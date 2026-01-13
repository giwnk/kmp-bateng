<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PembentukanKoperasi extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    // Tabel ini biasanya berdiri sendiri buat grafik history tahunan
}
