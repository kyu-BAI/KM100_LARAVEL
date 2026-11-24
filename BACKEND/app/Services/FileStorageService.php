<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use InvalidArgumentException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class FileStorageService
{
    protected string $disk = 'public';

    /**
     * Store an uploaded file safely on the configured disk.
     */
    public function uploadFile(UploadedFile $file, string $folder = 'documents', ?User $user = null): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];

        if (!in_array($extension, $allowedExtensions)) {
            throw new InvalidArgumentException("File extension [{$extension}] is not permitted.");
        }

        $safeName = (string) Str::uuid() . '.' . $extension;
        $relativeDir = sprintf('%s/%s/%s', trim($folder, '/'), date('Y'), date('m'));
        $storedPath = $file->storeAs($relativeDir, $safeName, $this->disk);

        $url = Storage::disk($this->disk)->url($storedPath);
        $fileSizeKb = round($file->getSize() / 1024, 1) . ' KB';

        return [
            'file_name' => $file->getClientOriginalName(),
            'storage_path' => $storedPath,
            'file_path' => $url,
            'file_format' => strtoupper($extension),
            'file_size' => $fileSizeKb,
            'mime_type' => $file->getMimeType(),
            'uploaded_by' => $user?->id,
        ];
    }

    /**
     * Handles receipt image storage. If base64 data URL is provided, decodes and
     * stores to the configured public disk, returning the relative storage URL.
     * If an existing URL or raw string is provided, returns it unchanged.
     */
    public function storeReceiptImage(?string $filePathData, string $folder = 'receipts'): ?string
    {
        if (empty($filePathData)) {
            return null;
        }

        // Check if string is a base64 image data URL
        if (preg_match('/^data:image\/(\w+);base64,/', $filePathData, $matches)) {
            $imageType = strtolower($matches[1]);
            $base64Data = substr($filePathData, strpos($filePathData, ',') + 1);
            $decodedBinary = base64_decode($base64Data);

            if ($decodedBinary === false) {
                // If decoding fails, retain raw string to prevent data loss
                return $filePathData;
            }

            $extension = ($imageType === 'jpeg' || $imageType === 'jpg') ? 'jpg' : $imageType;
            $relativeDir = sprintf('%s/%s/%s', trim($folder, '/'), date('Y'), date('m'));
            $fileName = sprintf('%s/%s.%s', $relativeDir, (string) Str::uuid(), $extension);

            Storage::disk($this->disk)->put($fileName, $decodedBinary);

            return Storage::disk($this->disk)->url($fileName);
        }

        return $filePathData;
    }

    /**
     * Resolve and validate a stored file path, preventing directory traversal.
     */
    public function resolveFilePath(string $path, ?User $user = null): string
    {
        // Sanitize path against directory traversal
        $cleanPath = str_replace(['..', '\\', "\0"], '', $path);
        $cleanPath = ltrim($cleanPath, '/');

        // Check if path includes /storage/ prefix
        if (str_starts_with($cleanPath, 'storage/')) {
            $cleanPath = substr($cleanPath, 8);
        }

        if (!Storage::disk($this->disk)->exists($cleanPath)) {
            throw new NotFoundHttpException("File not found at specified storage path: [{$cleanPath}].");
        }

        // Branch-level access authorization for employee accounts
        if ($user && $user->isEmployee() && !empty($user->branch) && $user->branch !== 'All') {
            $url = Storage::disk($this->disk)->url($cleanPath);
            $receiptModels = [
                \App\Models\PetcExpenseReceipt::class,
                \App\Models\RedGooseExpenseReceipt::class,
                \App\Models\KnoahMariExpenseReceipt::class,
                \App\Models\PetcSalesReceipt::class,
                \App\Models\PetcInsuranceReceipt::class,
                \App\Models\InventoryItem::class,
                \App\Models\ConsumablesReceipt::class,
                \App\Models\VoucherReceipt::class,
            ];

            foreach ($receiptModels as $model) {
                $foreignRecord = $model::where(function ($q) use ($cleanPath, $url) {
                    $q->where('file_path', 'like', "%{$cleanPath}%")
                      ->orWhere('file_path', 'like', "%{$url}%");
                })->first();

                if ($foreignRecord && !empty($foreignRecord->entity) && $foreignRecord->entity !== $user->branch) {
                    throw new AccessDeniedHttpException("Unauthorized access to file belonging to branch: [{$foreignRecord->entity}].");
                }
            }
        }

        return Storage::disk($this->disk)->path($cleanPath);
    }

    /**
     * Delete a stored file from disk safely.
     */
    public function deleteFile(string $path, ?User $user = null): bool
    {
        if ($user && $user->isEmployee()) {
            throw new AccessDeniedHttpException("Only administrators can delete storage files.");
        }

        $cleanPath = str_replace(['..', '\\', "\0"], '', $path);
        $cleanPath = ltrim($cleanPath, '/');

        if (str_starts_with($cleanPath, 'storage/')) {
            $cleanPath = substr($cleanPath, 8);
        }

        if (Storage::disk($this->disk)->exists($cleanPath)) {
            return Storage::disk($this->disk)->delete($cleanPath);
        }

        return false;
    }

    /**
     * List files in a storage directory safely.
     */
    public function listFiles(string $folder = 'documents'): array
    {
        $cleanFolder = str_replace(['..', '\\', "\0"], '', $folder);
        $files = Storage::disk($this->disk)->allFiles($cleanFolder);

        $result = [];
        foreach ($files as $file) {
            $result[] = [
                'name' => basename($file),
                'path' => $file,
                'url' => Storage::disk($this->disk)->url($file),
                'size' => Storage::disk($this->disk)->size($file),
                'last_modified' => Storage::disk($this->disk)->lastModified($file),
            ];
        }

        return $result;
    }
}
