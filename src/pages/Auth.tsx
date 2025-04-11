
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("login");
  const { signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (tab === "login") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Navbar />
      <div className="container px-4 py-16 flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="flex items-center justify-center h-20 w-20 bg-primary/10 rounded-full mb-8">
          <User className="h-10 w-10 text-primary" />
        </div>
        
        <Card className="w-full bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">
              {tab === "login" ? t('auth.signIn') : t('auth.createAccount')}
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              {tab === "login" ? t('auth.signInDesc') : t('auth.signUpDesc')}
            </CardDescription>
          </CardHeader>
          
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-gray-800">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                {t('auth.login')}
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                {t('auth.signup')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.pleaseWait') : t('auth.signIn')}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.pleaseWait') : t('auth.createAccount')}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
