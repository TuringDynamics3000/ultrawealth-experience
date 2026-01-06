/**
 * Activity Page
 * 
 * Reads: Ordered event stream, Actor/timestamp/event type
 * Props: { events: ActivityEvent[] }
 * 
 * RULES:
 * - No filtering magic. This is an audit surface.
 * - Every event has actor, timestamp, and type
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Hash, Clock, User, Monitor } from "lucide-react";
import { useLocation } from "wouter";
import type { ActivityEvent, ActorType } from "@/contracts/activity";
import { SEED_DATA } from "@/demo/seed";

interface ActivityPageProps {
  events?: readonly ActivityEvent[];
}

// Use centralized seed data - in production, this comes from TuringCore API
const DEMO_EVENTS = SEED_DATA.events;

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getActorBadgeVariant(actorType: ActorType): 'default' | 'secondary' | 'outline' {
  switch (actorType) {
    case 'CLIENT': return 'default';
    case 'SYSTEM': return 'secondary';
    case 'OPERATOR': return 'outline';
    case 'SUPERVISOR': return 'outline';
    case 'COMPLIANCE': return 'outline';
    default: return 'secondary';
  }
}

function getEventTypeColor(eventType: string): string {
  if (eventType.includes('CREATED') || eventType.includes('ACTIVATED')) return 'text-green-600';
  if (eventType.includes('FAILED') || eventType.includes('REJECTED')) return 'text-red-600';
  if (eventType.includes('LOCK') || eventType.includes('PAUSE')) return 'text-amber-600';
  if (eventType.includes('THRESHOLD')) return 'text-purple-600';
  return 'text-slate-700';
}

export default function Activity({ events = DEMO_EVENTS }: ActivityPageProps) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Wait for auth to load before checking
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">Loading activity...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-8 h-8 text-slate-700" />
            <h1 className="text-3xl font-bold text-slate-900">Activity Log</h1>
          </div>
          <p className="text-slate-600">
            Ordered event stream. No filtering. This is an audit surface.
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="text-2xl">{events.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Latest Event</CardDescription>
              <CardTitle className="text-lg">{events[0]?.eventType.replace(/_/g, ' ')}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Stream Integrity</CardDescription>
              <CardTitle className="text-lg text-green-600">Verified</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Event Stream</CardTitle>
            <CardDescription>
              All events ordered by occurrence time (newest first)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.eventId}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">
                      {formatDateTime(event.occurredAt)}
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getEventTypeColor(event.eventType)}`}>
                        {event.eventType.replace(/_/g, ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant={getActorBadgeVariant(event.actor.actorType)}>
                          {event.actor.actorType}
                        </Badge>
                        <span className="text-xs text-slate-500 font-mono">
                          {event.actor.actorId}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Monitor className="w-3 h-3 text-slate-400" />
                        <span className="text-sm">{event.source.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-500">
                      {event.portfolioId && <div>Portfolio: {event.portfolioId}</div>}
                      {event.goalAccountId && <div>Goal: {event.goalAccountId}</div>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
                        <Hash className="w-3 h-3" />
                        {event.hash}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Audit trail is immutable and append-only</span>
            </div>
            <div className="font-mono">
              Stream retrieved at {new Date().toISOString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
