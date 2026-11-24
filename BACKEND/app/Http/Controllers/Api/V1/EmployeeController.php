<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\StoreEmployeeRequest;
use App\Http\Requests\V1\UpdateEmployeeRequest;
use App\Http\Resources\V1\UserResource;
use App\Services\EmployeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class EmployeeController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    /**
     * Ensure only administrators can access employee management.
     */
    protected function authorizeAdmin(Request $request): void
    {
        if (!$request->user()->isAdmin()) {
            throw new AccessDeniedHttpException('Only administrators can manage employee accounts.');
        }
    }

    /**
     * List all employees.
     */
    public function index(Request $request): JsonResponse
    {
        $this->authorizeAdmin($request);
        $employees = $this->employeeService->listEmployees();

        return response()->json([
            'success' => true,
            'data' => UserResource::collection($employees),
        ], 200);
    }

    /**
     * Create a new employee account.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        $this->authorizeAdmin($request);
        $employee = $this->employeeService->createEmployee($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Employee account created successfully.',
            'data' => new UserResource($employee),
        ], 201);
    }

    /**
     * Show single employee details.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $this->authorizeAdmin($request);
        $employee = $this->employeeService->findEmployee($id);

        return response()->json([
            'success' => true,
            'data' => new UserResource($employee),
        ], 200);
    }

    /**
     * Update employee account.
     */
    public function update(UpdateEmployeeRequest $request, string $id): JsonResponse
    {
        $this->authorizeAdmin($request);
        $employee = $this->employeeService->updateEmployee($id, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Employee account updated successfully.',
            'data' => new UserResource($employee),
        ], 200);
    }

    /**
     * Delete employee account.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $this->authorizeAdmin($request);
        $this->employeeService->deleteEmployee($id);

        return response()->json([
            'success' => true,
            'message' => 'Employee account deleted successfully.',
        ], 200);
    }
}
