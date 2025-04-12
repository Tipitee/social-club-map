import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gavel, Shield, Sprout, ScrollText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";

const CannabisGuide: React.FC = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Dynamic styles based on theme
  const getPageBackground = () => isDarkMode 
    ? "bg-gradient-to-b from-[#13141f] to-[#1c1f2e] text-white" 
    : "bg-gradient-to-b from-oldLace-DEFAULT to-cadetGray-100 text-gray-800";
  
  const getCardBackground = () => isDarkMode 
    ? "bg-gray-800/70 border-gray-700 shadow-xl" 
    : "bg-white/80 border-gray-200 shadow-md";
  
  const getTabsActiveClass = () => isDarkMode 
    ? "data-[state=active]:bg-primary" 
    : "data-[state=active]:bg-teal-DEFAULT data-[state=active]:text-white";
  
  const getTextClass = () => isDarkMode 
    ? "text-white" 
    : "text-gray-800";
  
  const getSubtitleClass = () => isDarkMode 
    ? "text-gray-300" 
    : "text-gray-600";
  
  const getAccordionTriggerClass = () => isDarkMode 
    ? "text-gray-300 hover:text-white" 
    : "text-gray-700 hover:text-black";
  
  const getAccordionContentClass = () => isDarkMode 
    ? "text-gray-400" 
    : "text-gray-600";

  return (
    <div className={`min-h-screen ${getPageBackground()} pb-20`}>
      <Navbar />
      <main className="container px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Cannabis Guide</h1>
          <p className={getSubtitleClass()}>Learn about cannabis use, laws, and best practices</p>
        </div>

        <Tabs defaultValue="laws" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="laws" className={getTabsActiveClass()}>
              <Gavel className="h-4 w-4 mr-2" />
              Laws
            </TabsTrigger>
            <TabsTrigger value="safeUse" className={getTabsActiveClass()}>
              <Shield className="h-4 w-4 mr-2" />
              Safe Use
            </TabsTrigger>
            <TabsTrigger value="basics" className={getTabsActiveClass()}>
              <Sprout className="h-4 w-4 mr-2" />
              Basics
            </TabsTrigger>
            <TabsTrigger value="health" className={getTabsActiveClass()}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Health
            </TabsTrigger>
          </TabsList>
          
          {/* Laws & Regulations Content */}
          <TabsContent value="laws" className="space-y-6">
            <Card className={getCardBackground()}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="h-5 w-5 mr-2 text-primary" />
                  Laws and Regulations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className={getTextClass()}>
                  <AccordionItem value="possession">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Possession Limits
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>As of April 2023, adults in Germany are permitted to possess up to 25 grams of cannabis for personal use in public spaces and up to 50 grams in private residences. Additionally, adults are allowed to grow up to three cannabis plants at home for personal consumption.</p>
                      <p className="mt-2">These limits apply to the entire federal territory. Exceeding these limits can result in fines or criminal charges depending on the quantity involved.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="consumption">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Consumption Regulations
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Cannabis consumption is prohibited in certain public areas, including:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Within 100 meters of schools, children's playgrounds, and sports facilities</li>
                        <li>In pedestrian zones between 7:00 AM and 8:00 PM</li>
                        <li>In public parks if children or adolescents are present</li>
                      </ul>
                      <p className="mt-2">Violations can result in administrative fines. Always be mindful of your surroundings when consuming cannabis.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="driving">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Driving Restrictions
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Driving under the influence of cannabis remains strictly prohibited. The legal limit for THC while driving is set at 1 nanogram per milliliter of blood.</p>
                      <p className="mt-2">Penalties for driving under the influence of cannabis include:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Monetary fines starting at €500</li>
                        <li>License suspension for at least one month</li>
                        <li>Two points in the driving offense registry</li>
                      </ul>
                      <p className="mt-2">For regular consumers, THC can be detectable in blood for several days after consumption, even when no longer impaired.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="clubs">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Cannabis Social Clubs
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Cannabis Social Clubs (CSCs) are non-profit associations that can cultivate and distribute cannabis exclusively to their members. These clubs operate under specific regulations:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Maximum of 500 adult members per club</li>
                        <li>Members must be residents in the same federal state as the club</li>
                        <li>Distribution limited to 25 grams per day and 50 grams per month per member</li>
                        <li>Clubs must maintain minimum distances from schools and facilities for children</li>
                        <li>Sale of cannabis products is restricted to plain packaging with health warnings</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Safe Use Content */}
          <TabsContent value="safeUse" className="space-y-6">
            <Card className={getCardBackground()}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  Safe Use Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className={getTextClass()}>
                  <AccordionItem value="startLow">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Start Low, Go Slow
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>When trying cannabis, especially for beginners or when trying a new strain or product:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Begin with a minimal dose (1-2.5mg THC for edibles, small inhalation for smoking)</li>
                        <li>Wait at least 15-30 minutes between inhalations</li>
                        <li>For edibles, wait at least 2 hours before taking more</li>
                        <li>Gradually increase dosage in small increments if needed</li>
                      </ul>
                      <p className="mt-2">This approach helps prevent uncomfortable experiences and allows you to find your optimal dose.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="knowSource">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Know Your Source
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Obtaining cannabis from reliable and legal sources is crucial for safety:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Purchase from licensed cannabis social clubs when possible</li>
                        <li>Be cautious of products from unregulated sources</li>
                        <li>Look for lab-tested products with clear potency information</li>
                        <li>Avoid products with signs of mold, unusual odors, or contaminants</li>
                      </ul>
                      <p className="mt-2">Quality cannabis should have proper labeling including strain information, THC/CBD content, and harvest date.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="mindset">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Set and Setting
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Your mental state and environment significantly impact your cannabis experience:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Choose a comfortable, familiar environment when consuming</li>
                        <li>Have a trusted person present, especially for new experiences</li>
                        <li>Avoid cannabis if you're experiencing negative emotions or anxiety</li>
                        <li>Don't mix cannabis with alcohol or other substances</li>
                        <li>Plan activities beforehand and have necessities (water, snacks) nearby</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="hydration">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Stay Hydrated
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Cannabis can cause dry mouth (cottonmouth) and mild dehydration:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Drink water before, during, and after cannabis use</li>
                        <li>Keep non-alcoholic, non-caffeinated beverages nearby</li>
                        <li>Herbal teas can be particularly soothing for dry throat</li>
                        <li>Avoid excessive sugary drinks which can worsen dehydration</li>
                      </ul>
                      <p className="mt-2">Proper hydration helps minimize side effects and enhances the overall experience.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Basics Content */}
          <TabsContent value="basics" className="space-y-6">
            <Card className={getCardBackground()}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sprout className="h-5 w-5 mr-2 text-primary" />
                  Cannabis Basics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className={getTextClass()}>
                  <AccordionItem value="compounds">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Key Compounds
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Cannabis contains over 100 cannabinoids, with these being most significant:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>THC (Tetrahydrocannabinol):</strong> The primary psychoactive compound responsible for the "high." It can provide pain relief, appetite stimulation, and mood elevation.</li>
                        <li><strong>CBD (Cannabidiol):</strong> Non-intoxicating compound known for potential anti-inflammatory, anti-anxiety, and anti-seizure properties.</li>
                        <li><strong>CBN (Cannabinol):</strong> Mildly psychoactive, formed when THC ages. Often associated with sedative effects.</li>
                        <li><strong>CBG (Cannabigerol):</strong> Non-psychoactive precursor to other cannabinoids, being studied for various potential therapeutic properties.</li>
                      </ul>
                      <p className="mt-2">Terpenes are aromatic compounds that give cannabis its distinctive smell and contribute to its effects through the "entourage effect."</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="methods">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Consumption Methods
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Different consumption methods produce varying effects and onset times:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Inhalation (Smoking/Vaping):</strong> Effects begin within minutes and typically last 2-4 hours. Dosage is easier to control.</li>
                        <li><strong>Oral Consumption (Edibles):</strong> Effects take 30-120 minutes to begin but can last 6-8 hours. More potent and longer-lasting than inhalation.</li>
                        <li><strong>Sublingual (Tinctures):</strong> Placed under the tongue, effects begin within 15-45 minutes and last 2-6 hours.</li>
                        <li><strong>Topical (Creams/Balms):</strong> Applied to skin for localized relief without psychoactive effects.</li>
                      </ul>
                      <p className="mt-2">Each method has different bioavailability (percentage of cannabinoids that enter the bloodstream), affecting potency and duration.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="types">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Cannabis Types
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Cannabis is commonly categorized into three main types:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-2">
                        <li><strong>Sativa:</strong> Typically associated with energizing, uplifting effects. Often used for daytime use, creativity, and mood enhancement.</li>
                        <li><strong>Indica:</strong> Generally linked to relaxing, sedating effects. Commonly used for evening use, sleep aid, and physical relaxation.</li>
                        <li><strong>Hybrid:</strong> Cross-breeds of sativa and indica strains with balanced or specialized effects depending on the parent genetics.</li>
                      </ul>
                      <p className="mt-2">Modern understanding focuses more on cannabinoid and terpene profiles rather than simple indica/sativa classification, as effects can vary significantly within these categories.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tolerance">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Tolerance and Breaks
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Regular cannabis use can lead to tolerance, requiring more to achieve the same effects:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Tolerance typically begins developing within a few days of regular use</li>
                        <li>Tolerance to different effects develops at different rates</li>
                        <li>Taking "tolerance breaks" of 1-4 weeks can help reset sensitivity</li>
                        <li>Rotating between different strains can help manage tolerance</li>
                      </ul>
                      <p className="mt-2">If you find yourself needing significantly more cannabis to achieve desired effects, consider taking a short break or reducing consumption.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <Card className={getCardBackground()}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                  Health Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className={getTextClass()}>
                  <AccordionItem value="risks">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Potential Risks
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>While cannabis has therapeutic benefits, it also carries potential risks:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Impaired memory and concentration during use</li>
                        <li>Respiratory issues when smoked (bronchitis, chronic cough)</li>
                        <li>Potential for psychological dependence</li>
                        <li>May trigger anxiety or paranoia in some individuals</li>
                        <li>Impacts on brain development in those under 25</li>
                      </ul>
                      <p className="mt-2">Individual responses vary significantly based on genetics, existing health conditions, and consumption patterns.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="interactions">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Medication Interactions
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Cannabis can interact with various medications:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Blood thinners (increased bleeding risk)</li>
                        <li>Blood pressure medications (potential for hypotension)</li>
                        <li>Sedatives and CNS depressants (heightened sedation)</li>
                        <li>Some antidepressants and psychiatric medications</li>
                        <li>Certain anticonvulsants and pain medications</li>
                      </ul>
                      <p className="mt-2">Always consult with a healthcare provider about potential interactions between cannabis and your medications.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="conditions">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Medical Contraindications
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Certain conditions may be worsened by cannabis use:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>History of psychosis or schizophrenia</li>
                        <li>Severe cardiovascular disease</li>
                        <li>Pregnancy and breastfeeding</li>
                        <li>Substance use disorders</li>
                        <li>Certain respiratory conditions when smoking</li>
                      </ul>
                      <p className="mt-2">If you have any pre-existing health conditions, consult a healthcare provider before using cannabis.</p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="overuse">
                    <AccordionTrigger className={getAccordionTriggerClass()}>
                      Signs of Overuse
                    </AccordionTrigger>
                    <AccordionContent className={getAccordionContentClass()}>
                      <p>Recognizing problematic use patterns is important:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Using more frequently or in larger amounts than intended</li>
                        <li>Difficulty cutting down or controlling use</li>
                        <li>Spending significant time obtaining, using, or recovering from cannabis</li>
                        <li>Continued use despite negative consequences</li>
                        <li>Neglecting important activities due to cannabis use</li>
                      </ul>
                      <p className="mt-2">If you're concerned about your cannabis use, speak with a healthcare provider or counselor who specializes in substance use issues.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CannabisGuide;
