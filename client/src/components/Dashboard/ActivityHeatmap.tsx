import React from 'react';

interface HeatmapData {
    date: string;
    count: number;
}

interface ActivityHeatmapProps {
    data: HeatmapData[];
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ data }) => {
    // Helper to get local date string YYYY-MM-DD
    const getLocalDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Generate full year of dates
    const today = new Date();
    const dates = [];
    for (let i = 364; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        dates.push(d);
    }

    // Map: DateString -> { count, messages }
    const dataMap = new Map(data.map((d: any) => [d.date, { count: d.count, messages: d.messages || [] }]));

    const weeks: (any | null)[][] = [];
    let currentWeek: (any | null)[] = [];

    // Week alignment
    const firstDay = dates[0].getDay(); 
    for(let i=0; i<firstDay; i++) {
        currentWeek.push(null);
    }

    dates.forEach(date => {
        const dateStr = getLocalDate(date); // Use local date string
        const dayData = dataMap.get(dateStr);
        currentWeek.push({
            date: dateStr,
            count: dayData ? dayData.count : 0,
            messages: dayData ? dayData.messages : []
        });
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });
    if (currentWeek.length > 0) weeks.push(currentWeek);


    // Month labels logic
    const monthLabels: { name: string, weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, wIndex) => {
        // Check the first valid day in the week
        const firstDay = week.find(d => d !== null);
        if (firstDay) {
            const date = new Date(firstDay.date);
            const month = date.getMonth();
            if (month !== lastMonth) {
                // Determine month name
                const monthName = date.toLocaleString('default', { month: 'short' });
                monthLabels.push({ name: monthName, weekIndex: wIndex });
                lastMonth = month;
            }
        }
    });

    const getColor = (count: number) => {
        if (count === 0) return '#ebedf0'; // Empty
        if (count === 1) return '#d4d4d4'; // Light Grey
        if (count === 2) return '#a3a3a3'; // Medium
        if (count === 3) return '#6e6e6e'; // Dark
        return '#171717';                  // Black-ish
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-visible w-full">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-800">Contribution Activity</h3>
            </div>
            
            <div className="w-full overflow-x-auto">
                <div className="min-w-max">
                     {/* Month Labels */}
                    <div className="flex mb-2 text-xs text-gray-400 relative h-4">
                        {monthLabels.map((label, i) => (
                             <div 
                                key={i} 
                                style={{ 
                                    position: 'absolute', 
                                    left: `${label.weekIndex * 16}px` // 12px width + 4px gap
                                }}
                            >
                                {label.name}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-1">
                        {weeks.map((week, wIndex) => (
                            <div key={wIndex} className="flex flex-col gap-1">
                                {week.map((day : any, dIndex : number) => (
                                    <div 
                                        key={dIndex}
                                        className={`w-3 h-3 rounded-sm relative group ${!day ? 'opacity-0' : ''}`}
                                        style={{ 
                                            backgroundColor: day ? getColor(day.count) : 'transparent' 
                                        }}
                                    >
                                        {/* Tooltip */}
                                        {day && day.count > 0 && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50 min-w-max max-w-xs whitespace-normal bg-black text-white text-xs rounded py-1 px-2 shadow-lg pointer-events-none">
                                                <div className="font-bold mb-1">{day.date}</div>
                                                {day.messages.map((msg: string, i: number) => (
                                                    <div key={i} className="border-b border-gray-700 last:border-0 pb-1 mb-1 last:pb-0 last:mb-0">
                                                        - {msg}
                                                    </div>
                                                ))}
                                                <div className="mt-1 text-gray-400 font-mono text-[10px]">{day.count} commits</div>
                                                
                                                {/* Arrow */}
                                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end text-xs text-gray-400 mt-4 space-x-2">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-[#ebedf0]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#d4d4d4]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#a3a3a3]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#6e6e6e]"></div>
                    <div className="w-3 h-3 rounded-sm bg-[#171717]"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default ActivityHeatmap;
