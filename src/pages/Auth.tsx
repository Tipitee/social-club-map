
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
  const { signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-linen to-ashGray-200 dark:from-[#13141f] dark:to-[#1c1f2e]">
      <Navbar />
      <div className="container px-4 py-16 flex flex-col items-center justify-center max-w-md mx-auto">
        <div className="flex items-center justify-center h-24 w-24 bg-teal-light/20 dark:bg-primary/10 rounded-full mb-8">
          <User className="h-12 w-12 text-teal dark:text-primary" />
        </div>
        
        <Card className="w-full bg-white/90 dark:bg-gray-900/80 border-gray-200 dark:border-gray-800 shadow-xl backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-navy-dark dark:text-white">
              {tab === "login" ? "Welcome Back" : "Join Us Today"}
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300 text-lg">
              {tab === "login" 
                ? "Sign in to your account to track your cannabis journey" 
                : "Create an account to start tracking your cannabis experiences"}
            </CardDescription>
          </CardHeader>
          
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-2 bg-gray-100 dark:bg-gray-800/80 mb-4">
              <TabsTrigger value="login" className="text-base data-[state=active]:bg-teal data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-base data-[state=active]:bg-teal data-[state=active]:text-white dark:data-[state=active]:bg-primary dark:data-[state=active]:text-white">
                Create Account
              </TabsTrigger>
            </TabsList>
            
            {error && (
              <div className="mx-6 mb-4 p-3 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 rounded-md flex items-center gap-2 text-red-700 dark:text-red-200">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-navy-dark dark:text-white text-base">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 py-6 bg-white dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-navy-dark dark:text-white text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-navy-dark dark:text-white text-base">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 py-6 bg-white dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-navy-dark dark:text-white text-base"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button 
                    type="submit" 
                    className="w-full bg-teal hover:bg-teal-dark dark:bg-primary dark:hover:bg-primary/90 text-white py-6 text-lg font-medium" 
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm text-center">
                    Don't have an account? <span className="text-teal dark:text-primary cursor-pointer hover:underline" onClick={() => setTab("signup")}>Create one now</span>
                  </p>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-navy-dark dark:text-white text-base">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 py-6 bg-white dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-navy-dark dark:text-white text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-navy-dark dark:text-white text-base">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 py-6 bg-white dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 text-navy-dark dark:text-white text-base"
                      />
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col">
                  <Button 
                    type="submit" 
                    className="w-full bg-teal hover:bg-teal-dark dark:bg-primary dark:hover:bg-primary/90 text-white py-6 text-lg font-medium" 
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm text-center">
                    Already have an account? <span className="text-teal dark:text-primary cursor-pointer hover:underline" onClick={() => setTab("login")}>Sign in</span>
                  </p>
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
