import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Users, CalendarCheck2 } from "lucide-react";

const CoachDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Coach Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center space-x-4 py-6">
            <Users className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-xl font-semibold text-gray-800">24</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 py-6">
            <CalendarCheck2 className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-500">Upcoming Sessions</p>
              <p className="text-xl font-semibold text-gray-800">5</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center space-x-4 py-6">
            <BarChart3 className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-500">Client Progress</p>
              <p className="text-xl font-semibold text-gray-800">78%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoachDashboard;
