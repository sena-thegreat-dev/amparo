<?php

namespace App\Models;

use Database\Factories\AuditEventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use LogicException;

class AuditEvent extends Model
{
    /** @use HasFactory<AuditEventFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = ['author_user_id', 'action', 'auditable_type', 'auditable_id', 'before_state', 'after_state', 'reason', 'occurred_at'];

    protected function casts(): array
    {
        return ['before_state' => 'array', 'after_state' => 'array', 'occurred_at' => 'datetime'];
    }

    protected static function booted(): void
    {
        static::updating(fn (): never => throw new LogicException('Audit events are append-only.'));
        static::deleting(fn (): never => throw new LogicException('Audit events are append-only.'));
    }
}
