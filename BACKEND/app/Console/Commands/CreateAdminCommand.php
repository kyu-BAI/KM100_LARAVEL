<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'km100:create-admin 
                            {name? : Full Name of the administrator} 
                            {email? : Administrator email address} 
                            {password? : Plain text password (min 6 characters)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new Administrator account for KM100 MacroSync in MySQL';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $name = $this->argument('name') ?: $this->ask('Administrator Full Name');
        $email = $this->argument('email') ?: $this->ask('Administrator Email Address');
        $password = $this->argument('password') ?: $this->secret('Administrator Password (min 6 characters)');

        if (empty($name) || empty($email) || empty($password)) {
            $this->error('Name, email, and password are all required.');
            return 1;
        }

        if (strlen($password) < 6) {
            $this->error('Password must be at least 6 characters.');
            return 1;
        }

        $existing = User::where('email', $email)->first();
        if ($existing) {
            if ($this->confirm("User with email {$email} already exists. Update password and ensure admin role?")) {
                $existing->update([
                    'name' => $name,
                    'password' => Hash::make($password),
                    'role' => 'admin',
                    'branch' => 'All',
                    'department' => 'Administration',
                    'is_active' => true,
                ]);
                $this->info("Updated {$email} as Administrator successfully!");
                return 0;
            }
            $this->warn('Aborted.');
            return 1;
        }

        $user = User::create([
            'id' => (string) Str::uuid(),
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
            'branch' => 'All',
            'department' => 'Administration',
            'is_active' => true,
        ]);

        $this->newLine();
        $this->info('====================================================');
        $this->info(' Administrator Account Created Successfully!        ');
        $this->info('====================================================');
        $this->line(" Name:       {$user->name}");
        $this->line(" Email:      {$user->email}");
        $this->line(" Role:       {$user->role}");
        $this->line(" Branch:     {$user->branch}");
        $this->line(" UUID:       {$user->id}");
        $this->info('====================================================');

        return 0;
    }
}
