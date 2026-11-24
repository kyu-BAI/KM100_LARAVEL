<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EmployeeService
{
    /**
     * List all employee accounts with caching.
     */
    public function listEmployees(): Collection
    {
        $version = Cache::get('employees:version', 1);
        return Cache::remember("employees:v{$version}:list", 300, function () {
            return User::where('role', 'employee')
                ->orderBy('name', 'asc')
                ->get();
        });
    }

    /**
     * Invalidate employee list cache.
     */
    public function invalidateEmployeeCache(): void
    {
        try {
            Cache::increment('employees:version');
        } catch (\Throwable $e) {
            Cache::put('employees:version', time());
        }
    }

    /**
     * Create a new employee account.
     */
    public function createEmployee(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'employee',
            'branch' => $data['branch'] ?? 'PETC',
            'department' => $data['department'] ?? 'Operations',
            'is_active' => $data['is_active'] ?? true,
        ]);

        $this->invalidateEmployeeCache();

        return $user;
    }

    /**
     * Find employee by ID.
     */
    public function findEmployee(string $id): User
    {
        $employee = User::where('role', 'employee')->where('id', $id)->first();

        if (!$employee) {
            throw new NotFoundHttpException("Employee with ID [{$id}] not found.");
        }

        return $employee;
    }

    /**
     * Update an existing employee account.
     */
    public function updateEmployee(string $id, array $data): User
    {
        $employee = $this->findEmployee($id);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $employee->update($data);
        $this->invalidateEmployeeCache();

        return $employee->fresh();
    }

    /**
     * Delete or deactivate an employee account.
     */
    public function deleteEmployee(string $id): bool
    {
        $employee = $this->findEmployee($id);
        $deleted = (bool) $employee->delete();
        $this->invalidateEmployeeCache();

        return $deleted;
    }
}
