
import React from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Gavel, Shield, Sprout, AlertTriangle } from "lucide-react";

const CannabisGuide: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.language === 'de';
  
  return (
    <div className="min-h-screen bg-linen dark:bg-navy-dark pb-28">
      <Navbar />
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-navy-dark dark:text-white">
          {t('navigation.guide')}
        </h1>
        
        <Tabs defaultValue="laws" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="laws">
              <Gavel className="h-4 w-4 mr-2" />
              {t('guide.laws')}
            </TabsTrigger>
            <TabsTrigger value="safeUse">
              <Shield className="h-4 w-4 mr-2" />
              {t('guide.safeUse')}
            </TabsTrigger>
            <TabsTrigger value="basics">
              <Sprout className="h-4 w-4 mr-2" />
              {t('guide.basics')}
            </TabsTrigger>
            <TabsTrigger value="health">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {t('guide.health')}
            </TabsTrigger>
          </TabsList>
          
          {/* Laws & Regulations Content */}
          <TabsContent value="laws" className="space-y-6">
            <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gavel className="h-5 w-5 mr-2 text-primary" />
                  {t('guide.lawsAndRegulations')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="text-navy-dark dark:text-white">
                  <AccordionItem value="possession">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.possessionLimits')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Seit April 2023 dürfen Erwachsene in Deutschland bis zu 25 Gramm Cannabis für den persönlichen Gebrauch in öffentlichen Räumen und bis zu 50 Gramm in privaten Wohnungen besitzen. Zusätzlich dürfen Erwachsene bis zu drei Cannabispflanzen zu Hause für den persönlichen Konsum anbauen.</p>
                          <p className="mt-2">Diese Grenzen gelten für das gesamte Bundesgebiet. Ein Überschreiten dieser Grenzen kann je nach Menge zu Geldstrafen oder strafrechtlichen Konsequenzen führen.</p>
                        </>
                      ) : (
                        <>
                          <p>As of April 2023, adults in Germany are permitted to possess up to 25 grams of cannabis for personal use in public spaces and up to 50 grams in private residences. Additionally, adults are allowed to grow up to three cannabis plants at home for personal consumption.</p>
                          <p className="mt-2">These limits apply to the entire federal territory. Exceeding these limits can result in fines or criminal charges depending on the quantity involved.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="consumption">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.consumptionRegulations')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Der Cannabiskonsum ist in bestimmten öffentlichen Bereichen verboten, darunter:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Innerhalb von 100 Metern von Schulen, Kinderspielplätzen und Sportanlagen</li>
                            <li>In Fußgängerzonen zwischen 7:00 und 20:00 Uhr</li>
                            <li>In öffentlichen Parks, wenn Kinder oder Jugendliche anwesend sind</li>
                          </ul>
                          <p className="mt-2">Verstöße können zu Verwaltungsstrafen führen. Achten Sie stets auf Ihre Umgebung, wenn Sie Cannabis konsumieren.</p>
                        </>
                      ) : (
                        <>
                          <p>Cannabis consumption is prohibited in certain public areas, including:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Within 100 meters of schools, children's playgrounds, and sports facilities</li>
                            <li>In pedestrian zones between 7:00 AM and 8:00 PM</li>
                            <li>In public parks if children or adolescents are present</li>
                          </ul>
                          <p className="mt-2">Violations can result in administrative fines. Always be mindful of your surroundings when consuming cannabis.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="driving">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.drivingRestrictions')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Das Fahren unter Einfluss von Cannabis bleibt streng verboten. Der gesetzliche Grenzwert für THC beim Fahren liegt bei 1 Nanogramm pro Milliliter Blut.</p>
                          <p className="mt-2">Strafen für das Fahren unter Cannabiseinfluss umfassen:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Geldstrafen ab 500 €</li>
                            <li>Führerscheinentzug für mindestens einen Monat</li>
                            <li>Zwei Punkte im Fahreignungsregister</li>
                          </ul>
                          <p className="mt-2">Für regelmäßige Konsumenten kann THC noch mehrere Tage nach dem Konsum im Blut nachweisbar sein, auch wenn keine Beeinträchtigung mehr vorliegt.</p>
                        </>
                      ) : (
                        <>
                          <p>Driving under the influence of cannabis remains strictly prohibited. The legal limit for THC while driving is set at 1 nanogram per milliliter of blood.</p>
                          <p className="mt-2">Penalties for driving under the influence of cannabis include:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Monetary fines starting at €500</li>
                            <li>License suspension for at least one month</li>
                            <li>Two points in the driving offense registry</li>
                          </ul>
                          <p className="mt-2">For regular consumers, THC can be detectable in blood for several days after consumption, even when no longer impaired.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="clubs">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.cannabisSocialClubs')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Cannabis Social Clubs (CSCs) sind gemeinnützige Vereine, die Cannabis ausschließlich für ihre Mitglieder anbauen und verteilen können. Diese Clubs unterliegen spezifischen Vorschriften:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Maximal 500 erwachsene Mitglieder pro Club</li>
                            <li>Mitglieder müssen im selben Bundesland wie der Club wohnen</li>
                            <li>Verteilung beschränkt auf 25 Gramm pro Tag und 50 Gramm pro Monat pro Mitglied</li>
                            <li>Clubs müssen Mindestabstände zu Schulen und Einrichtungen für Kinder einhalten</li>
                            <li>Verkauf von Cannabisprodukten ist auf schlichte Verpackungen mit Gesundheitswarnungen beschränkt</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <p>Cannabis Social Clubs (CSCs) are non-profit associations that can cultivate and distribute cannabis exclusively to their members. These clubs operate under specific regulations:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Maximum of 500 adult members per club</li>
                            <li>Members must be residents in the same federal state as the club</li>
                            <li>Distribution limited to 25 grams per day and 50 grams per month per member</li>
                            <li>Clubs must maintain minimum distances from schools and facilities for children</li>
                            <li>Sale of cannabis products is restricted to plain packaging with health warnings</li>
                          </ul>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Safe Use Content */}
          <TabsContent value="safeUse" className="space-y-6">
            <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-primary" />
                  {t('guide.safeUsePractices')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="text-navy-dark dark:text-white">
                  <AccordionItem value="startLow">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.startLow')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Bei der Verwendung von Cannabis, besonders für Anfänger oder beim Ausprobieren einer neuen Sorte oder eines neuen Produkts:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Beginnen Sie mit einer minimalen Dosis (1-2,5 mg THC für Esswaren, kleine Inhalation beim Rauchen)</li>
                            <li>Warten Sie mindestens 15-30 Minuten zwischen den Inhalationen</li>
                            <li>Bei Esswaren mindestens 2 Stunden warten, bevor mehr genommen wird</li>
                            <li>Dosis bei Bedarf langsam in kleinen Schritten steigern</li>
                          </ul>
                          <p className="mt-2">Dieser Ansatz hilft, unangenehme Erfahrungen zu vermeiden und ermöglicht es Ihnen, Ihre optimale Dosis zu finden.</p>
                        </>
                      ) : (
                        <>
                          <p>When trying cannabis, especially for beginners or when trying a new strain or product:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Begin with a minimal dose (1-2.5mg THC for edibles, small inhalation for smoking)</li>
                            <li>Wait at least 15-30 minutes between inhalations</li>
                            <li>For edibles, wait at least 2 hours before taking more</li>
                            <li>Gradually increase dosage in small increments if needed</li>
                          </ul>
                          <p className="mt-2">This approach helps prevent uncomfortable experiences and allows you to find your optimal dose.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="knowSource">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.knowSource')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Die Beschaffung von Cannabis aus zuverlässigen und legalen Quellen ist entscheidend für die Sicherheit:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Kaufen Sie wenn möglich bei lizenzierten Cannabis Social Clubs</li>
                            <li>Seien Sie vorsichtig bei Produkten aus unregulierten Quellen</li>
                            <li>Achten Sie auf laborgetestete Produkte mit klaren Angaben zum Wirkstoffgehalt</li>
                            <li>Vermeiden Sie Produkte mit Anzeichen von Schimmel, ungewöhnlichem Geruch oder Verunreinigungen</li>
                          </ul>
                          <p className="mt-2">Qualitätscannabis sollte eine ordnungsgemäße Kennzeichnung mit Sorteninformationen, THC/CBD-Gehalt und Erntedatum haben.</p>
                        </>
                      ) : (
                        <>
                          <p>Obtaining cannabis from reliable and legal sources is crucial for safety:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Purchase from licensed cannabis social clubs when possible</li>
                            <li>Be cautious of products from unregulated sources</li>
                            <li>Look for lab-tested products with clear potency information</li>
                            <li>Avoid products with signs of mold, unusual odors, or contaminants</li>
                          </ul>
                          <p className="mt-2">Quality cannabis should have proper labeling including strain information, THC/CBD content, and harvest date.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="mindset">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.setAndSetting')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Ihr Geisteszustand und Ihre Umgebung beeinflussen Ihre Cannabis-Erfahrung erheblich:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Wählen Sie eine komfortable, vertraute Umgebung für den Konsum</li>
                            <li>Haben Sie eine Vertrauensperson anwesend, besonders bei neuen Erfahrungen</li>
                            <li>Vermeiden Sie Cannabis, wenn Sie negative Emotionen oder Angstzustände erleben</li>
                            <li>Mischen Sie Cannabis nicht mit Alkohol oder anderen Substanzen</li>
                            <li>Planen Sie Aktivitäten im Voraus und halten Sie Notwendigkeiten (Wasser, Snacks) griffbereit</li>
                          </ul>
                        </>
                      ) : (
                        <>
                          <p>Your mental state and environment significantly impact your cannabis experience:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Choose a comfortable, familiar environment when consuming</li>
                            <li>Have a trusted person present, especially for new experiences</li>
                            <li>Avoid cannabis if you're experiencing negative emotions or anxiety</li>
                            <li>Don't mix cannabis with alcohol or other substances</li>
                            <li>Plan activities beforehand and have necessities (water, snacks) nearby</li>
                          </ul>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="hydration">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.stayHydrated')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Cannabis kann einen trockenen Mund (Cottonmouth) und leichte Dehydrierung verursachen:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Trinken Sie vor, während und nach dem Cannabis-Konsum Wasser</li>
                            <li>Halten Sie nicht-alkoholische, koffeinfreie Getränke bereit</li>
                            <li>Kräutertees können besonders wohltuend für einen trockenen Hals sein</li>
                            <li>Vermeiden Sie übermäßig zuckerhaltige Getränke, die die Dehydrierung verschlimmern können</li>
                          </ul>
                          <p className="mt-2">Ausreichende Flüssigkeitszufuhr hilft, Nebenwirkungen zu minimieren und verbessert das Gesamterlebnis.</p>
                        </>
                      ) : (
                        <>
                          <p>Cannabis can cause dry mouth (cottonmouth) and mild dehydration:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Drink water before, during, and after cannabis use</li>
                            <li>Keep non-alcoholic, non-caffeinated beverages nearby</li>
                            <li>Herbal teas can be particularly soothing for dry throat</li>
                            <li>Avoid excessive sugary drinks which can worsen dehydration</li>
                          </ul>
                          <p className="mt-2">Proper hydration helps minimize side effects and enhances the overall experience.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Basics Content */}
          <TabsContent value="basics" className="space-y-6">
            <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sprout className="h-5 w-5 mr-2 text-primary" />
                  {t('guide.cannabisBasics')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="text-navy-dark dark:text-white">
                  <AccordionItem value="compounds">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.compounds')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Cannabis enthält über 100 Cannabinoide, wobei diese am wichtigsten sind:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>THC (Tetrahydrocannabinol):</strong> Die wichtigste psychoaktive Verbindung, die für den "Rausch" verantwortlich ist. Sie kann Schmerzlinderung, Appetitanregung und Stimmungsaufhellung bewirken.</li>
                            <li><strong>CBD (Cannabidiol):</strong> Nicht berauschende Verbindung, die für potenzielle entzündungshemmende, angstlösende und antikonvulsive Eigenschaften bekannt ist.</li>
                            <li><strong>CBN (Cannabinol):</strong> Leicht psychoaktiv, entsteht beim Altern von THC. Oft mit sedierenden Wirkungen verbunden.</li>
                            <li><strong>CBG (Cannabigerol):</strong> Nicht-psychoaktiver Vorläufer anderer Cannabinoide, der auf verschiedene potenzielle therapeutische Eigenschaften untersucht wird.</li>
                          </ul>
                          <p className="mt-2">Terpene sind aromatische Verbindungen, die Cannabis seinen charakteristischen Geruch verleihen und durch den "Entourage-Effekt" zu seiner Wirkung beitragen.</p>
                        </>
                      ) : (
                        <>
                          <p>Cannabis contains over 100 cannabinoids, with these being most significant:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>THC (Tetrahydrocannabinol):</strong> The primary psychoactive compound responsible for the "high." It can provide pain relief, appetite stimulation, and mood elevation.</li>
                            <li><strong>CBD (Cannabidiol):</strong> Non-intoxicating compound known for potential anti-inflammatory, anti-anxiety, and anti-seizure properties.</li>
                            <li><strong>CBN (Cannabinol):</strong> Mildly psychoactive, formed when THC ages. Often associated with sedative effects.</li>
                            <li><strong>CBG (Cannabigerol):</strong> Non-psychoactive precursor to other cannabinoids, being studied for various potential therapeutic properties.</li>
                          </ul>
                          <p className="mt-2">Terpenes are aromatic compounds that give cannabis its distinctive smell and contribute to its effects through the "entourage effect."</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="methods">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.methods')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Verschiedene Konsummethoden erzeugen unterschiedliche Wirkungen und Wirkungszeiten:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Inhalation (Rauchen/Verdampfen):</strong> Wirkungen beginnen innerhalb von Minuten und halten typischerweise 2-4 Stunden an. Die Dosierung ist leichter zu kontrollieren.</li>
                            <li><strong>Orale Einnahme (Esswaren):</strong> Die Wirkungen beginnen nach 30-120 Minuten, können aber 6-8 Stunden anhalten. Stärker und länger anhaltend als Inhalation.</li>
                            <li><strong>Sublingual (Tinkturen):</strong> Unter die Zunge gelegt, beginnen die Wirkungen innerhalb von 15-45 Minuten und halten 2-6 Stunden an.</li>
                            <li><strong>Topisch (Cremes/Balsame):</strong> Auf die Haut aufgetragen für lokale Linderung ohne psychoaktive Wirkungen.</li>
                          </ul>
                          <p className="mt-2">Jede Methode hat eine unterschiedliche Bioverfügbarkeit (Prozentsatz der Cannabinoide, die in den Blutkreislauf gelangen), was sich auf Stärke und Dauer auswirkt.</p>
                        </>
                      ) : (
                        <>
                          <p>Different consumption methods produce varying effects and onset times:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Inhalation (Smoking/Vaping):</strong> Effects begin within minutes and typically last 2-4 hours. Dosage is easier to control.</li>
                            <li><strong>Oral Consumption (Edibles):</strong> Effects take 30-120 minutes to begin but can last 6-8 hours. More potent and longer-lasting than inhalation.</li>
                            <li><strong>Sublingual (Tinctures):</strong> Placed under the tongue, effects begin within 15-45 minutes and last 2-6 hours.</li>
                            <li><strong>Topical (Creams/Balms):</strong> Applied to skin for localized relief without psychoactive effects.</li>
                          </ul>
                          <p className="mt-2">Each method has different bioavailability (percentage of cannabinoids that enter the bloodstream), affecting potency and duration.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="types">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.types')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Cannabis wird allgemein in drei Haupttypen eingeteilt:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Sativa:</strong> Typischerweise mit energetisierenden, aufmunternden Wirkungen verbunden. Oft für die Tageszeit, Kreativität und Stimmungsverbesserung verwendet.</li>
                            <li><strong>Indica:</strong> Allgemein mit entspannenden, beruhigenden Wirkungen verbunden. Häufig für abendliche Nutzung, als Schlafhilfe und zur körperlichen Entspannung.</li>
                            <li><strong>Hybrid:</strong> Kreuzungen aus Sativa- und Indica-Sorten mit ausgewogenen oder spezialisierten Wirkungen, je nach den Elterngenen.</li>
                          </ul>
                          <p className="mt-2">Modernes Verständnis konzentriert sich mehr auf Cannabinoid- und Terpenprofil als auf die einfache Indica/Sativa-Klassifizierung, da die Wirkungen innerhalb dieser Kategorien erheblich variieren können.</p>
                        </>
                      ) : (
                        <>
                          <p>Cannabis is commonly categorized into three main types:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-2">
                            <li><strong>Sativa:</strong> Typically associated with energizing, uplifting effects. Often used for daytime use, creativity, and mood enhancement.</li>
                            <li><strong>Indica:</strong> Generally linked to relaxing, sedating effects. Commonly used for evening use, sleep aid, and physical relaxation.</li>
                            <li><strong>Hybrid:</strong> Cross-breeds of sativa and indica strains with balanced or specialized effects depending on the parent genetics.</li>
                          </ul>
                          <p className="mt-2">Modern understanding focuses more on cannabinoid and terpene profiles rather than simple indica/sativa classification, as effects can vary significantly within these categories.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="tolerance">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.tolerance')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Regelmäßiger Cannabiskonsum kann zu Toleranz führen, wodurch mehr benötigt wird, um die gleiche Wirkung zu erzielen:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Toleranz beginnt sich typischerweise innerhalb weniger Tage regelmäßiger Nutzung zu entwickeln</li>
                            <li>Toleranz gegenüber verschiedenen Wirkungen entwickelt sich in unterschiedlichem Tempo</li>
                            <li>"Toleranzpausen" von 1-4 Wochen können helfen, die Empfindlichkeit zurückzusetzen</li>
                            <li>Wechseln zwischen verschiedenen Sorten kann helfen, Toleranz zu managen</li>
                          </ul>
                          <p className="mt-2">Wenn Sie feststellen, dass Sie deutlich mehr Cannabis benötigen, um die gewünschten Wirkungen zu erzielen, erwägen Sie eine kurze Pause oder reduzieren Sie den Konsum.</p>
                        </>
                      ) : (
                        <>
                          <p>Regular cannabis use can lead to tolerance, requiring more to achieve the same effects:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Tolerance typically begins developing within a few days of regular use</li>
                            <li>Tolerance to different effects develops at different rates</li>
                            <li>Taking "tolerance breaks" of 1-4 weeks can help reset sensitivity</li>
                            <li>Rotating between different strains can help manage tolerance</li>
                          </ul>
                          <p className="mt-2">If you find yourself needing significantly more cannabis to achieve desired effects, consider taking a short break or reducing consumption.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Health Tab */}
          <TabsContent value="health" className="space-y-6">
            <Card className="border-navy-DEFAULT dark:border-navy-light bg-white dark:bg-navy-light shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
                  {t('guide.healthConsiderations')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="text-navy-dark dark:text-white">
                  <AccordionItem value="risks">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.risks')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Obwohl Cannabis therapeutische Vorteile hat, birgt es auch potenzielle Risiken:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Beeinträchtigtes Gedächtnis und Konzentration während der Nutzung</li>
                            <li>Atemwegsprobleme beim Rauchen (Bronchitis, chronischer Husten)</li>
                            <li>Potenzial für psychologische Abhängigkeit</li>
                            <li>Kann bei manchen Personen Angstzustände oder Paranoia auslösen</li>
                            <li>Auswirkungen auf die Gehirnentwicklung bei Personen unter 25 Jahren</li>
                          </ul>
                          <p className="mt-2">Individuelle Reaktionen variieren erheblich je nach Genetik, bestehenden Gesundheitszuständen und Konsummustern.</p>
                        </>
                      ) : (
                        <>
                          <p>While cannabis has therapeutic benefits, it also carries potential risks:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Impaired memory and concentration during use</li>
                            <li>Respiratory issues when smoked (bronchitis, chronic cough)</li>
                            <li>Potential for psychological dependence</li>
                            <li>May trigger anxiety or paranoia in some individuals</li>
                            <li>Impacts on brain development in those under 25</li>
                          </ul>
                          <p className="mt-2">Individual responses vary significantly based on genetics, existing health conditions, and consumption patterns.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="interactions">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.interactions')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Cannabis kann mit verschiedenen Medikamenten interagieren:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Blutverdünner (erhöhtes Blutungsrisiko)</li>
                            <li>Blutdruckmedikamente (Potenzial für Hypotonie)</li>
                            <li>Sedativa und ZNS-Depressiva (verstärkte Sedierung)</li>
                            <li>Einige Antidepressiva und psychiatrische Medikamente</li>
                            <li>Bestimmte Antikonvulsiva und Schmerzmedikamente</li>
                          </ul>
                          <p className="mt-2">Konsultieren Sie immer einen Gesundheitsdienstleister zu möglichen Wechselwirkungen zwischen Cannabis und Ihren Medikamenten.</p>
                        </>
                      ) : (
                        <>
                          <p>Cannabis can interact with various medications:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Blood thinners (increased bleeding risk)</li>
                            <li>Blood pressure medications (potential for hypotension)</li>
                            <li>Sedatives and CNS depressants (heightened sedation)</li>
                            <li>Some antidepressants and psychiatric medications</li>
                            <li>Certain anticonvulsants and pain medications</li>
                          </ul>
                          <p className="mt-2">Always consult with a healthcare provider about potential interactions between cannabis and your medications.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="conditions">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.conditions')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Bestimmte Zustände können durch Cannabiskonsum verschlimmert werden:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Vorgeschichte von Psychosen oder Schizophrenie</li>
                            <li>Schwere kardiovaskuläre Erkrankungen</li>
                            <li>Schwangerschaft und Stillzeit</li>
                            <li>Substanzkonsumstörungen</li>
                            <li>Bestimmte Atemwegserkrankungen beim Rauchen</li>
                          </ul>
                          <p className="mt-2">Wenn Sie bereits bestehende Gesundheitszustände haben, konsultieren Sie vor der Verwendung von Cannabis einen Gesundheitsdienstleister.</p>
                        </>
                      ) : (
                        <>
                          <p>Certain conditions may be worsened by cannabis use:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>History of psychosis or schizophrenia</li>
                            <li>Severe cardiovascular disease</li>
                            <li>Pregnancy and breastfeeding</li>
                            <li>Substance use disorders</li>
                            <li>Certain respiratory conditions when smoking</li>
                          </ul>
                          <p className="mt-2">If you have any pre-existing health conditions, consult a healthcare provider before using cannabis.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="overuse">
                    <AccordionTrigger className="hover:text-primary dark:hover:text-primary-light">
                      {t('guide.overuse')}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700 dark:text-gray-300">
                      {isGerman ? (
                        <>
                          <p>Das Erkennen problematischer Nutzungsmuster ist wichtig:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Häufigere oder größere Mengen nutzen als beabsichtigt</li>
                            <li>Schwierigkeiten beim Reduzieren oder Kontrollieren des Konsums</li>
                            <li>Erhebliche Zeit mit der Beschaffung, dem Konsum oder der Erholung von Cannabis verbringen</li>
                            <li>Fortgesetzter Konsum trotz negativer Konsequenzen</li>
                            <li>Vernachlässigung wichtiger Aktivitäten aufgrund von Cannabiskonsum</li>
                          </ul>
                          <p className="mt-2">Wenn Sie besorgt über Ihren Cannabiskonsum sind, sprechen Sie mit einem Gesundheitsdienstleister oder Berater, der sich auf Substanznutzungsprobleme spezialisiert hat.</p>
                        </>
                      ) : (
                        <>
                          <p>Recognizing problematic use patterns is important:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Using more frequently or in larger amounts than intended</li>
                            <li>Difficulty cutting down or controlling use</li>
                            <li>Spending significant time obtaining, using, or recovering from cannabis</li>
                            <li>Continued use despite negative consequences</li>
                            <li>Neglecting important activities due to cannabis use</li>
                          </ul>
                          <p className="mt-2">If you're concerned about your cannabis use, speak with a healthcare provider or counselor who specializes in substance use issues.</p>
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CannabisGuide;
