import React from 'react';

interface HeatmapData {
    date: string;
    count: number;
}

interface ActivityHeatmapProps {
    data: HeatmapData[];
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
    // Generate full year of dates
    const today = new Date();
    const dates = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        dates.push(d);
    }

    const dataMap = new Map(data.map(d => [d.date, d.count]));

    const weeks: (HeatmapData | null)[][] = [];
    let currentWeek: (HeatmapData | null)[] = [];

    // Week alignment
    const firstDay = dates[0].getDay(); 
    for(let i=0; i<firstDay; i++) {
        currentWeek.push(null);
    }

    dates.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        currentWeek.push({
            date: dateStr,
            count: dataMap.get(dateStr) || 0
        });
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);


    const getColor = (count: number) => {
        if (count === 0) return '#f3f4f6'; // Very light gray (Empty)
        if (count < 2) return '#d1d5db';   // Gray 300
        if (count < 4) return '#9ca3af';   // Gray 400
        if (count < 6) return '#4b5563';   // Gray 600
        return '#111827';                  // Gray 900 (Black)
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-visible">
            <h3 className="font-bold text-gray-800 mb-6">Activity Heatmap</h3>
            
            <div className="flex flex-col items-end overflow-hidden w-full"> 
                <div className="flex gap-1 pb-2 overflow-x-auto w-full justify-end">
                    {weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-1">
                            {week.map((day : any, dIndex : number) => (
                                <div 
                                    key={dIndex}
                                    title={day ? `${day.count} activities on ${day.date}` : ''}
                                    className={`w-3 h-3 rounded-sm ${!day ? 'opacity-0' : ''}`}
                                    style={{ 
                                        backgroundColor: day ? getColor(day.count) : 'transparent' 
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end text-xs text-gray-400 mt-4 space-x-2">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[#f3f4f6]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#d1d5db]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#9ca3af]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#4b5563]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#111827]"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
