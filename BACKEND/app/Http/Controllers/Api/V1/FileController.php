<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\FileStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class FileController extends Controller
{
    protected FileStorageService $storageService;

    public function __construct(FileStorageService $storageService)
    {
        $this->storageService = $storageService;
    }

    /**
     * List uploaded files.
     */
    public function index(Request $request): JsonResponse
    {
        $folder = $request->query('folder', 'documents');
        $files = $this->storageService->listFiles($folder);

        return response()->json([
            'success' => true,
            'data' => $files,
            'meta' => [
                'total' => count($files),
                'folder' => $folder,
            ],
        ], 200);
    }

    /**
     * Upload a file (multipart file or base64 image payload).
     */
    public function upload(Request $request): JsonResponse
    {
        if ($request->hasFile('file')) {
            $request->validate([
                'file' => [
                    'required',
                    'file',
                    'mimes:jpg,jpeg,png,webp,pdf',
                    'max:20480', // 20 MB max
                ],
                'folder' => ['nullable', 'string', 'max:50'],
            ]);

            $folder = $request->input('folder', 'documents');
            $uploaded = $this->storageService->uploadFile(
                $request->file('file'),
                $folder,
                $request->user()
            );

            return response()->json([
                'success' => true,
                'message' => 'File uploaded successfully.',
                'data' => $uploaded,
            ], 201);
        }

        // Support base64 image upload (via image_base64 or file payload)
        $base64Payload = $request->input('image_base64') ?? $request->input('file');

        if (!$base64Payload || !is_string($base64Payload)) {
            return response()->json([
                'success' => false,
                'message' => 'The file or image_base64 field is required.',
                'errors' => [
                    'file' => ['A multipart file or valid base64 image payload is required.'],
                ],
            ], 422);
        }

        $folder = $request->input('folder', 'receipts');
        $url = $this->storageService->storeReceiptImage(
            $base64Payload,
            $folder
        );

        return response()->json([
            'success' => true,
            'message' => 'Base64 image stored successfully.',
            'data' => [
                'file_path' => $url,
            ],
        ], 201);
    }

    /**
     * Retrieve or download a stored file.
     */
    public function show(Request $request, string $path): BinaryFileResponse
    {
        $realPath = $this->storageService->resolveFilePath($path, $request->user());

        return response()->file($realPath);
    }

    /**
     * Delete a stored file (Admin only).
     */
    public function destroy(Request $request, string $path): JsonResponse
    {
        $this->storageService->deleteFile($path, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'File deleted successfully from storage.',
        ], 200);
    }
}
