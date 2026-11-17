import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@lab/ui/card';
import { Badge } from '@lab/ui/badge';
import { Avatar, AvatarFallback } from '@lab/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@lab/ui/alert';
import { Skeleton } from '@lab/ui/skeleton';
import { Progress } from '@lab/ui/progress';
import { Button } from '@lab/ui/button';
import { ScrollArea } from '@lab/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@lab/ui/table';

const examples = [
  { name: 'Field notes', initials: 'FN', state: 'Ready', variant: 'default' },
  { name: 'Little experiments', initials: 'LE', state: 'In progress', variant: 'secondary' },
  { name: 'Next idea', initials: 'NI', state: 'Draft', variant: 'outline' },
] as const;

export function Content() {
  const [progress, setProgress] = useState(40);
  const [loading, setLoading] = useState(false);
  return (
    <section id="ui-content" className="ui-showcase-section" aria-labelledby="content-title">
      <div className="ui-showcase-section-heading">
        <span>05 / Content & feedback</span>
        <h3 id="content-title">Content & feedback</h3>
        <p>Clear status, useful empty space and loading states with a purpose.</p>
      </div>
      <div className="ui-showcase-content">
        <Card>
          <CardHeader>
            <CardTitle>Work in progress</CardTitle>
            <CardDescription>
              A manual progress example. No background job is running.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} aria-label="Example progress" />
            <p role="status">{progress}% complete</p>
            <div className="ui-showcase-row">
              <Button
                size="sm"
                onClick={() => setProgress(Math.min(100, progress + 20))}
                disabled={progress === 100}
              >
                Advance
              </Button>
              <Button size="sm" variant="outline" onClick={() => setProgress(0)}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loading preview</CardTitle>
            <CardDescription>Compare a skeleton with the content it represents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="ui-showcase-loading" aria-busy={loading} aria-live="polite">
              {loading ? (
                <div aria-label="Loading example" role="status" className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <span className="sr-only">Loading example</span>
                </div>
              ) : (
                <p>Your next idea starts with a small experiment.</p>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={() => setLoading(!loading)}>
              {loading ? 'Show content' : 'Show skeleton'}
            </Button>
          </CardContent>
        </Card>
        <div className="ui-showcase-wide">
          <Alert>
            <AlertTitle>Ready to explore</AlertTitle>
            <AlertDescription>
              These examples use the shared components directly. Their state belongs to this demo.
            </AlertDescription>
          </Alert>
        </div>
        <div className="ui-showcase-wide ui-showcase-table">
          <Table>
            <TableCaption>Example projects · local display data</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examples.map((item) => (
                <TableRow key={item.name}>
                  <TableCell>
                    <div className="ui-showcase-inline">
                      <Avatar>
                        <AvatarFallback>{item.initials}</AvatarFallback>
                      </Avatar>
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.variant}>{item.state}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Card className="ui-showcase-wide">
          <CardHeader>
            <CardTitle>Small details worth checking</CardTitle>
            <CardDescription>
              A bounded scroll area. Focus it to scroll with the keyboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea
              className="h-40"
              viewportProps={{ role: 'region', 'aria-label': 'Component checklist' }}
            >
              <ul className="ui-showcase-checklist">
                {[
                  'Labels explain every input.',
                  'Focus remains visible.',
                  'Disabled controls look unavailable.',
                  'Long text wraps without losing content.',
                  'Error messages explain the next step.',
                  'Menus work with arrow keys.',
                  'Dialogs have a title and description.',
                  'Overlays return focus to their trigger.',
                  'Reduced motion remains comfortable.',
                  'Small screens keep every action reachable.',
                ].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
