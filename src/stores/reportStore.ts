import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyReport, ReportTemplate, ReportMetrics } from '@/types';
import { generateId } from '@/utils/helpers';

interface ReportState {
  // 日报数据
  reports: DailyReport[];
  setReports: (reports: DailyReport[]) => void;
  addReport: (report: Omit<DailyReport, 'id' | 'createdAt'>) => DailyReport;
  updateReport: (id: string, updates: Partial<DailyReport>) => void;
  deleteReport: (id: string) => void;

  // 当前编辑的日报
  currentReport: Partial<DailyReport> | null;
  setCurrentReport: (report: Partial<DailyReport> | null) => void;
  updateCurrentReport: (updates: Partial<DailyReport>) => void;

  // 报告模板
  templates: ReportTemplate[];
  setTemplates: (templates: ReportTemplate[]) => void;
  addTemplate: (template: Omit<ReportTemplate, 'id'>) => ReportTemplate;
  updateTemplate: (id: string, updates: Partial<ReportTemplate>) => void;
  deleteTemplate: (id: string) => void;

  // 日期范围
  dateRange: [string, string];
  setDateRange: (range: [string, string]) => void;

  // 统计
  getReportStats: (startDate?: string, endDate?: string) => ReportStats;

  // 导出
  exportReport: (id: string, format: 'markdown' | 'pdf' | 'html') => string;
}

interface ReportStats {
  totalReports: number;
  avgTasksCompleted: number;
  totalWorkTime: number;
  avgWorkTime: number;
  moodDistribution: Record<string, number>;
}

const defaultTemplate: ReportTemplate = {
  id: 'default',
  name: '默认模板',
  isDefault: true,
  sections: [
    { id: 'summary', title: '今日总结', type: 'text', required: true, order: 1 },
    { id: 'completed', title: '已完成任务', type: 'tasks', required: true, order: 2 },
    { id: 'pending', title: '待办任务', type: 'tasks', required: false, order: 3 },
    { id: 'blockers', title: '遇到的问题', type: 'text', required: false, order: 4 },
    { id: 'tomorrow', title: '明日计划', type: 'text', required: true, order: 5 },
    { id: 'metrics', title: '工作统计', type: 'metrics', required: false, order: 6 },
  ],
};

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],
      setReports: (reports) => set({ reports }),
      addReport: (reportData) => {
        const newReport: DailyReport = {
          ...reportData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ reports: [newReport, ...state.reports] }));
        return newReport;
      },
      updateReport: (id, updates) =>
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === id
              ? { ...report, ...updates, updatedAt: new Date().toISOString() }
              : report
          ),
        })),
      deleteReport: (id) =>
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
        })),

      currentReport: null,
      setCurrentReport: (report) => set({ currentReport: report }),
      updateCurrentReport: (updates) =>
        set((state) => ({
          currentReport: state.currentReport ? { ...state.currentReport, ...updates } : updates,
        })),

      templates: [defaultTemplate],
      setTemplates: (templates) => set({ templates }),
      addTemplate: (templateData) => {
        const newTemplate: ReportTemplate = {
          ...templateData,
          id: generateId(),
        };
        set((state) => ({ templates: [...state.templates, newTemplate] }));
        return newTemplate;
      },
      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        })),
      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
        })),

      dateRange: ['', ''],
      setDateRange: (range) => set({ dateRange: range }),

      getReportStats: (startDate, endDate) => {
        const { reports } = get();
        let filteredReports = reports;
        
        if (startDate && endDate) {
          filteredReports = reports.filter(
            (r) => r.date >= startDate && r.date <= endDate
          );
        }

        const totalReports = filteredReports.length;
        if (totalReports === 0) {
          return {
            totalReports: 0,
            avgTasksCompleted: 0,
            totalWorkTime: 0,
            avgWorkTime: 0,
            moodDistribution: {},
          };
        }

        const totalTasks = filteredReports.reduce(
          (sum, r) => sum + r.metrics.tasksCompleted,
          0
        );
        const totalWorkTime = filteredReports.reduce(
          (sum, r) => sum + r.metrics.totalWorkTime,
          0
        );

        const moodDistribution: Record<string, number> = {};
        filteredReports.forEach((r) => {
          if (r.mood) {
            moodDistribution[r.mood] = (moodDistribution[r.mood] || 0) + 1;
          }
        });

        return {
          totalReports,
          avgTasksCompleted: totalTasks / totalReports,
          totalWorkTime,
          avgWorkTime: totalWorkTime / totalReports,
          moodDistribution,
        };
      },

      exportReport: (id, format) => {
        const { reports } = get();
        const report = reports.find((r) => r.id === id);
        if (!report) return '';

        if (format === 'markdown') {
          return `# ${report.userName}的日报 - ${report.date}

## 今日总结
${report.summary}

## 已完成任务 (${report.completedTasks.length})
${report.completedTasks.map((t) => `- [x] ${t.title}`).join('\n')}

## 待办任务 (${report.pendingTasks.length})
${report.pendingTasks.map((t) => `- [ ] ${t.title}`).join('\n')}

${report.blockers ? `## 遇到的问题\n${report.blockers}\n` : ''}

## 明日计划
${report.tomorrowPlan}

## 工作统计
- 完成任务数: ${report.metrics.tasksCompleted}
- 总工作时间: ${Math.round(report.metrics.totalWorkTime / 60)}小时
- 专注时间: ${Math.round(report.metrics.focusTime / 60)}小时
- 会议时间: ${Math.round(report.metrics.meetingTime / 60)}小时

${report.mood ? `今日心情: ${report.mood}` : ''}
`;
        }

        // TODO: 实现 PDF 和 HTML 导出
        return '';
      },
    }),
    {
      name: 'lingma-report-storage',
      partialize: (state) => ({
        reports: state.reports,
        templates: state.templates,
      }),
    }
  )
);
