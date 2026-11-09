<?php

namespace Modules\Notifications\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user('api')
            ->notifications()
            ->latest()
            ->paginate(10);

        return response()->json($notifications);
    }

    public function markAsRead(Request $request, string $id)
    {
        $notification = $request->user('api')
            ->notifications()
            ->find($id);

        if (!$notification) {
            return response()->json([
                'message' => 'Notification not found.'
            ], 404);
        }

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marked as read successfully.',
            'notification' => $notification->fresh()
        ]);
    }
}
