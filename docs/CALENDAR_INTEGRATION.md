# Calendar Integration

This document describes the calendar integration functionality in the EF app.

## Overview

The calendar integration allows users to:
- Export individual events to their device's calendar app
- Automatically update favorite events when they change (requires backend API)
- Track which events have been exported to prevent duplicates

## Components

### `useEventCalendar` Hook

Main hook for calendar operations:

```typescript
const { 
    exportEventWithConfirmation, 
    isExporting, 
    isSupported, 
    isAlreadyExported 
} = useEventCalendar(event);
```

- `exportEventWithConfirmation`: Shows confirmation dialog before exporting
- `exportEventToCalendar`: Direct export without confirmation
- `isExporting`: Boolean indicating if an export is in progress
- `isSupported`: Boolean indicating if calendar is supported on the platform
- `isAlreadyExported`: Boolean indicating if the event is already exported

### `useCalendarAutoUpdate` Hook

Handles automatic updates for favorite events:

```typescript
const { 
    pendingUpdates, 
    autoUpdateEnabled 
} = useCalendarAutoUpdate();
```

- Automatically runs in the App component
- Updates calendar events when favorite events change
- Will be enhanced when backend API becomes available

### Calendar State Management

Redux store tracks exported events:

```typescript
interface CalendarEventMapping {
    eventId: string;          // EF event ID
    calendarEventId: string;  // Device calendar event ID
    exportedAt: string;       // When it was exported
    autoUpdate: boolean;      // Whether to auto-update
}
```

## Usage

### In EventContent Component

The calendar export button is automatically shown when the `shareButton` prop is true and the platform supports calendar operations:

```tsx
<EventContent event={event} shareButton={true} />
```

### Manual Export

```typescript
const result = await exportEventToCalendar(event);
if (result.success) {
    console.log('Event exported with ID:', result.eventId);
} else {
    console.error('Export failed:', result.error);
}
```

## Permissions

The calendar integration automatically requests calendar permissions when needed. Users will see a system dialog requesting access to their calendar.

## Platform Support

- ✅ iOS: Full support
- ✅ Android: Full support  
- ❌ Web: Not supported (calendar operations are disabled)

## Future Enhancements

When the backend API becomes available:
- Automatic updates will sync with server changes
- Bulk operations for multiple events
- Calendar subscription for live updates

## Error Handling

All calendar operations include proper error handling:
- Permission denied
- Calendar not available
- Network errors (future)
- Invalid event data

Errors are automatically logged to Sentry for monitoring.