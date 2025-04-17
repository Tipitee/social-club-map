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
  events
}) => {
  return <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold mb-4 text-navy-dark dark:text-white">Upcoming Events</h3>
        
        {events && events.length > 0 ? <div className="space-y-4">
            {events.map((event, index) => <div key={index} className="border-l-4 border-teal pl-4 py-px bg-navy-300">
                <div className="flex justify-between flex-wrap">
                  <h4 className="font-bold text-navy-dark dark:text-white">{event.name}</h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{event.date}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {event.description}
                </p>
              </div>)}
          </div> : <p className="text-gray-700 dark:text-gray-300">No upcoming events at this time.</p>}
        
        <div className="mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="events-info">
              <AccordionTrigger className="text-navy-dark dark:text-white px-[12px] bg-navy-400 hover:bg-navy-300">
                About Club Events
              </AccordionTrigger>
              <AccordionContent className="text-navy-dark dark:text-gray-300">
                <p className="mb-2 py-[12px] px-[2px]">
                  Our events are open to registered members only and are designed to educate, inform, and build community around responsible cannabis use.
                </p>
                <p className="px-[3px]">
                  Event registration is typically required. Please contact the club for more information about attending upcoming events.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>;
};
export default ClubEvents;