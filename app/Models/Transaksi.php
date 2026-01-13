<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;
    protected $guarded = ['id'];
    protected $casts = ['tanggal_transaksi' => 'date'];

    public function koperasi() {
        return $this->belongsTo(Koperasi::class);
    }
}
