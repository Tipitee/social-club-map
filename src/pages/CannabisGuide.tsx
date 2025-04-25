
import React from "react";
import { useTranslation } from "react-i18next";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const CannabisGuide: React.FC = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: "Laws",
      items: [
        {
          title: t('guide.lawsAndRegulations'),
          content: [
            { subtitle: t('guide.possessionLimits'), text: t('guide.lawsIntro') },
            { subtitle: t('guide.consumptionRegulations'), text: t('guide.consumptionIntro') },
            { subtitle: t('guide.drivingRestrictions'), text: t('guide.drivingIntro') },
            { subtitle: t('guide.cannabisSocialClubs'), text: t('guide.lawsIntro') }
          ]
        }
      ]
    },
    {
      title: "Safe Use",
      items: [
        {
          title: t('guide.safeUsePractices'),
          content: [
            { subtitle: t('guide.startLow'), text: t('guide.safetyTips') },
            { subtitle: t('guide.knowSource'), text: t('guide.sourceImportance') },
            { subtitle: t('guide.setAndSetting'), text: t('guide.environmentMatters') },
            { subtitle: t('guide.stayHydrated'), text: t('guide.safetyTips') }
          ]
        }
      ]
    },
    {
      title: "Basics",
      items: [
        {
          title: t('guide.cannabisBasics'),
          content: [
            { subtitle: t('guide.compounds'), text: t('guide.cannabinoidsInfo') },
            { subtitle: t('guide.methods'), text: t('guide.consumptionMethods') },
            { subtitle: t('guide.types'), text: t('guide.strainTypes') },
            { subtitle: t('guide.tolerance'), text: t('guide.safetyTips') }
          ]
        }
      ]
    },
    {
      title: "Health",
      items: [
        {
          title: t('guide.healthConsiderations'),
          content: [
            { subtitle: t('guide.risks'), text: t('guide.riskAwareness') },
            { subtitle: t('guide.interactions'), text: t('guide.medicationInteractions') },
            { subtitle: t('guide.conditions'), text: t('guide.preExistingConditions') },
            { subtitle: t('guide.overuse'), text: t('guide.riskAwareness') }
          ]
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        {sections.map((section) => (
          <Button
            key={section.title}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            {section.title} <ChevronDown className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {section.items.map((item, index) => (
              <Accordion key={index} type="single" collapsible className="bg-card rounded-lg shadow-sm">
                {item.content.map((content, contentIndex) => (
                  <AccordionItem key={contentIndex} value={`item-${contentIndex}`}>
                    <AccordionTrigger className="px-4 py-4 hover:no-underline">
                      <span className="text-lg font-medium">{content.subtitle}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <p className="text-muted-foreground">{content.text}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CannabisGuide;
