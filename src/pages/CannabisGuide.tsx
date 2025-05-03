
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronDown, BookOpen, Scale, FlaskConical, Heart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const CannabisGuide: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("laws");

  const sections = [
    {
      id: "laws",
      title: t('guide.laws'),
      icon: <Scale className="h-5 w-5" />,
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
      id: "safe-use",
      title: t('guide.safeUse'),
      icon: <BookOpen className="h-5 w-5" />,
      items: [
        {
          title: t('guide.safeUsePractices'),
          content: [
            { 
              subtitle: t('guide.startLow'), 
              text: "When trying cannabis, especially for beginners, start with a small amount and wait to see how it affects you before consuming more. Different products and strains vary greatly in potency." 
            },
            { 
              subtitle: t('guide.knowSource'), 
              text: "Always obtain cannabis from legal, regulated sources. This ensures quality control and reduces the risk of contaminants or unknown potency levels." 
            },
            { 
              subtitle: t('guide.setAndSetting'), 
              text: "Your mindset and physical environment significantly impact your cannabis experience. Choose comfortable, familiar surroundings and a positive mental state when consuming." 
            },
            { 
              subtitle: t('guide.stayHydrated'), 
              text: "Cannabis can cause dry mouth and dehydration. Keep water nearby and drink regularly throughout your session." 
            }
          ]
        }
      ]
    },
    {
      id: "basics",
      title: t('guide.basics'),
      icon: <FlaskConical className="h-5 w-5" />,
      items: [
        {
          title: t('guide.cannabisBasics'),
          content: [
            { 
              subtitle: t('guide.compounds'), 
              text: "Cannabis contains over 100 cannabinoids, with THC and CBD being the most well-known. THC produces psychoactive effects, while CBD offers potential therapeutic benefits without intoxication." 
            },
            { 
              subtitle: t('guide.methods'), 
              text: "Cannabis can be consumed through smoking, vaporizing, edibles, tinctures, topicals, and more. Each method offers different onset times, durations, and experiences." 
            },
            { 
              subtitle: t('guide.types'), 
              text: "The main cannabis varieties are indica (typically more relaxing), sativa (often more energizing), and hybrid strains that combine characteristics of both." 
            },
            { 
              subtitle: t('guide.tolerance'), 
              text: "Regular cannabis use can lead to tolerance, requiring more to achieve the same effects. Taking breaks helps reset your tolerance and maintains the efficacy of the plant." 
            }
          ]
        }
      ]
    },
    {
      id: "health",
      title: t('guide.health'),
      icon: <Heart className="h-5 w-5" />,
      items: [
        {
          title: t('guide.healthConsiderations'),
          content: [
            { 
              subtitle: t('guide.risks'), 
              text: "While cannabis has many benefits, it also carries potential risks including temporary anxiety, impaired memory, dependency for some individuals, and potential respiratory issues when smoked." 
            },
            { 
              subtitle: t('guide.interactions'), 
              text: "Cannabis can interact with certain medications, including blood thinners, antidepressants, and sedatives. Always consult a healthcare provider if you take prescription medications." 
            },
            { 
              subtitle: t('guide.conditions'), 
              text: "Individuals with certain mental health conditions, cardiovascular issues, or who are pregnant should exercise particular caution with cannabis use and seek medical advice." 
            },
            { 
              subtitle: t('guide.overuse'), 
              text: "Signs of problematic use include needing cannabis to function, neglecting responsibilities, withdrawal symptoms, and continued use despite negative consequences." 
            }
          ]
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 bg-background min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Cannabis Guide</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full mb-6 overflow-x-auto pb-2 scrollbar-none bg-muted">
          {sections.map((section) => (
            <TabsTrigger 
              key={section.id} 
              value={section.id}
              className="flex items-center gap-2 px-4 py-2"
            >
              {section.icon}
              <span>{section.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="space-y-6">
            {section.items.map((item, index) => (
              <div key={index} className="rounded-lg bg-card shadow-sm">
                <h3 className="text-xl font-medium p-4 text-card-foreground">{item.title}</h3>
                <Accordion type="single" collapsible className="w-full">
                  {item.content.map((content, contentIndex) => (
                    <AccordionItem key={contentIndex} value={`item-${contentIndex}`} className="border-b border-border">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline text-card-foreground">
                        <span className="text-lg">{content.subtitle}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <p className="text-muted-foreground">{content.text}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CannabisGuide;
