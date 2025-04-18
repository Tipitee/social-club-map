
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Event {
  name: string;
  date: string;
  description: string;
}

interface ClubEventsProps {
  events: Event[];
}

const ClubEvents: React.FC<ClubEventsProps> = ({
  events = []
}) => {
  // Ensure events is always an array even if undefined is passed
  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-card-foreground">Upcoming Events</h3>
        
        {safeEvents.length > 0 ? (
          <div className="space-y-4">
            {safeEvents.map((event, index) => (
              <div 
                key={`${event.name}-${index}`} 
                className="border-l-4 border-primary pl-4 py-2 bg-muted rounded-xl px-2"
              >
                <div className="flex justify-between flex-wrap">
                  <h4 className="font-bold text-card-foreground">{event.name}</h4>
                  <span className="text-sm text-muted-foreground">{event.date}</span>
                </div>
                <p className="text-card-foreground mt-1">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming events at this time.</p>
        )}
        
        <div className="mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="events-info" className="rounded-xl">
              <AccordionTrigger className="text-card-foreground px-3 bg-muted hover:bg-accent rounded-xl">
                About Club Events
              </AccordionTrigger>
              <AccordionContent className="text-card-foreground">
                <p className="mb-2 py-3 px-1">
                  Our events are open to registered members only and are designed to educate, inform, and build community around responsible cannabis use.
                </p>
                <p className="px-1">
                  Event registration is typically required. Please contact the club for more information about attending upcoming events.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubEvents;
