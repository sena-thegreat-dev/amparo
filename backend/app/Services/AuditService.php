<?php

namespace App\Services;

use App\Models\AuditEvent;
use App\Models\User;

class AuditService
{
    /** @param array<string, mixed>|null $before @param array<string, mixed>|null $after */
    public function record(?User $author, string $action, object $entity, ?array $before, ?array $after, ?string $reason): AuditEvent
    {
        return AuditEvent::create(['author_user_id' => $author?->id, 'action' => $action, 'auditable_type' => $entity::class, 'auditable_id' => $entity->id, 'before_state' => $before, 'after_state' => $after, 'reason' => $reason, 'occurred_at' => now()]);
    }
}
