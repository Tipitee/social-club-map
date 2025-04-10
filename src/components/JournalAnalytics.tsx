import React from "react";
import { JournalAnalytics } from "@/types/journal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, BarChart4, ThumbsUp, Pill } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface JournalAnalyticsProps {
  analytics: JournalAnalytics | null;
}

const JournalAnalyticsComponent: React.FC<JournalAnalyticsProps> = ({ analytics }) => {
  if (!analytics) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (analytics.entryCount === 0) {
    return (
      <div className="bg-card p-8 rounded-lg text-center border border-gray-700 mt-6">
        <BarChart4 size={48} className="mx-auto mb-4 text-gray-500" />
        <h3 className="text-xl font-semibold mb-2">No data available</h3>
        <p className="text-gray-400 mb-4">
          Add some journal entries to see your analytics
        </p>
      </div>
    );
  }

  const effectivenessPercentage = (analytics.averageEffectiveness / 5) * 100;

  return (
    <div className="space-y-6 mt-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <BarChart4 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.entryCount}</div>
            <p className="text-xs text-gray-500">Journal entries recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Effectiveness</CardTitle>
            <StarIcon className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{analytics.averageEffectiveness.toFixed(1)}</div>
              <div className="text-xs">/ 5</div>
            </div>
            <Progress className="mt-2" value={effectivenessPercentage} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Best Dosage Type</CardTitle>
            <Pill className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {analytics.mostEffectiveDosageType || "Not enough data"}
            </div>
            <p className="text-xs text-gray-500">Based on effectiveness ratings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Common Side Effects</CardTitle>
          <CardDescription>Most frequently reported side effects</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics.commonSideEffects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {analytics.commonSideEffects.map((effect, index) => (
                <div key={index} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                  {effect}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No side effects recorded</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest journal entries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.entryDates.slice(0, 5).map((date, index) => (
              <div key={index} className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                <span>{date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalAnalyticsComponent;
