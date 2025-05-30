import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    signIn,
    signUp,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    t
  } = useTranslation();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (tab === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-white dark:bg-navy-dark">
      <Navbar />
      <div className="container px-4 py-8 flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="flex items-center justify-center h-20 w-20 bg-teal-light/20 dark:bg-teal/20 rounded-full mb-6">
          <User className="h-10 w-10 text-teal dark:text-teal-light" />
        </div>
        
        <Card className="w-full bg-white/90 dark:bg-navy-light border-gray-200 dark:border-navy-300 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-navy-dark dark:text-white">
              {tab === "login" ? t("auth.welcomeBack") : t("auth.joinUsToday")}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300 text-base">
              {tab === "login" ? t("auth.signInDescription") : t("auth.createAccountDescription")}
            </CardDescription>
          </CardHeader>
          
          <Tabs value={tab} onValueChange={setTab} className="w-full px-[6px]">
            <TabsList className="grid grid-cols-2 bg-gray-100 dark:bg-navy-dark mb-4 px-[3px]">
              <TabsTrigger value="login" className="text-base data-[state=active]:bg-teal data-[state=active]:text-white dark:data-[state=active]:bg-teal dark:data-[state=active]:text-white px-0">
                {t("auth.signIn")}
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-base data-[state=active]:bg-teal data-[state=active]:text-white dark:data-[state=active]:bg-teal dark:data-[state=active]:text-white">
                {t("auth.createAccount")}
              </TabsTrigger>
            </TabsList>
            
            {error && <div className="mx-6 mb-4 p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 rounded-md flex items-center gap-2 text-red-700 dark:text-red-200">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>}
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 mt-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-navy-dark dark:text-white text-base">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <Input id="email" type="email" placeholder="your.email@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="pl-10 py-5 bg-white dark:bg-navy-400 border-gray-300 dark:border-navy-500 text-navy-dark dark:text-white text-base" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-navy-dark dark:text-white text-base">{t("auth.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="pl-10 py-5 bg-white dark:bg-navy-400 border-gray-300 dark:border-navy-500 text-navy-dark dark:text-white text-base" />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col px-6 pb-6">
                  <Button type="submit" className="w-full sm:w-3/4 mx-auto bg-teal hover:bg-teal-dark dark:bg-teal dark:hover:bg-teal-dark text-white py-5 text-lg font-medium" disabled={isSubmitting || isLoading}>
                    {isSubmitting || isLoading ? t("auth.signingIn") : t("auth.signIn")}
                  </Button>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm text-center">
                    {t("auth.noAccount")} <span className="text-teal dark:text-teal-light cursor-pointer hover:underline" onClick={() => setTab("signup")}>{t("auth.createOneNow")}</span>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 mt-2 pb-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-navy-dark dark:text-white text-base">{t("auth.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <Input id="signup-email" type="email" placeholder="your.email@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="pl-10 py-5 bg-white dark:bg-navy-400 border-gray-300 dark:border-navy-500 text-navy-dark dark:text-white text-base" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-navy-dark dark:text-white text-base">{t("auth.password")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                      <Input id="signup-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="pl-10 py-5 bg-white dark:bg-navy-400 border-gray-300 dark:border-navy-500 text-navy-dark dark:text-white text-base" />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col px-6 pb-6">
                  <Button type="submit" className="w-full sm:w-3/4 mx-auto bg-teal hover:bg-teal-dark dark:bg-teal dark:hover:bg-teal-dark text-white py-5 text-lg font-medium" disabled={isSubmitting || isLoading}>
                    {isSubmitting || isLoading ? t("auth.creatingAccount") : t("auth.createAccount")}
                  </Button>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm text-center">
                    {t("auth.haveAccount")} <span className="text-teal dark:text-teal-light cursor-pointer hover:underline" onClick={() => setTab("login")}>{t("auth.signIn")}</span>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>;
};
export default Auth;