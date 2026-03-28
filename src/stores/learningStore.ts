import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Skill, LearningGoal, LearningRecord, LearningCurveData } from '@/types';
import { generateId } from '@/utils/helpers';

interface LearningState {
  // 技能数据
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => Skill;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addSkillExp: (id: string, exp: number) => void;

  // 学习目标
  goals: LearningGoal[];
  setGoals: (goals: LearningGoal[]) => void;
  addGoal: (goal: Omit<LearningGoal, 'id' | 'createdAt'>) => LearningGoal;
  updateGoal: (id: string, updates: Partial<LearningGoal>) => void;
  deleteGoal: (id: string) => void;

  // 学习记录
  records: LearningRecord[];
  addRecord: (record: Omit<LearningRecord, 'id'>) => LearningRecord;
  deleteRecord: (id: string) => void;

  // 学习曲线数据
  getLearningCurveData: (days?: number) => LearningCurveData[];

  // 统计
  getLearningStats: () => LearningStats;

  // 选中技能
  selectedSkillId: string | null;
  setSelectedSkillId: (id: string | null) => void;
}

interface LearningStats {
  totalSkills: number;
  maxLevelSkills: number;
  totalGoals: number;
  completedGoals: number;
  totalPracticeTime: number;
  todayPracticeTime: number;
}

export const useLearningStore = create<LearningState>()(
  persist(
    (set, get) => ({
      skills: [],
      setSkills: (skills) => set({ skills }),
      addSkill: (skillData) => {
        const newSkill: Skill = {
          ...skillData,
          id: generateId(),
        };
        set((state) => ({ skills: [...state.skills, newSkill] }));
        return newSkill;
      },
      updateSkill: (id, updates) =>
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.id === id ? { ...skill, ...updates } : skill
          ),
        })),
      deleteSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((skill) => skill.id !== id),
        })),
      addSkillExp: (id, exp) =>
        set((state) => ({
          skills: state.skills.map((skill) => {
            if (skill.id !== id) return skill;
            const newExp = skill.currentExp + exp;
            // 简单的升级逻辑
            let newLevel = skill.level;
            let remainingExp = newExp;
            while (remainingExp >= skill.requiredExp && newLevel < skill.maxLevel) {
              remainingExp -= skill.requiredExp;
              newLevel++;
            }
            return {
              ...skill,
              currentExp: remainingExp,
              level: newLevel,
              lastPracticedAt: new Date().toISOString(),
              practiceCount: skill.practiceCount + 1,
            };
          }),
        })),

      goals: [],
      setGoals: (goals) => set({ goals }),
      addGoal: (goalData) => {
        const newGoal: LearningGoal = {
          ...goalData,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
        return newGoal;
      },
      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id ? { ...goal, ...updates } : goal
          ),
        })),
      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        })),

      records: [],
      addRecord: (recordData) => {
        const newRecord: LearningRecord = {
          ...recordData,
          id: generateId(),
        };
        set((state) => ({ records: [...state.records, newRecord] }));
        // 同时增加技能经验
        get().addSkillExp(recordData.skillId, recordData.duration / 10);
        return newRecord;
      },
      deleteRecord: (id) =>
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        })),

      getLearningCurveData: (days = 30) => {
        const { records } = get();
        const data: LearningCurveData[] = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          
          const dayRecords = records.filter((r) => r.date === dateStr);
          const daySkills = new Set(dayRecords.map((r) => r.skillId)).size;
          const practiceTime = dayRecords.reduce((sum, r) => sum + r.duration, 0);
          
          data.push({
            date: dateStr,
            totalExp: 0, // 需要累计计算
            newSkills: daySkills,
            practiceTime,
          });
        }
        
        // 计算累计经验
        let totalExp = 0;
        return data.map((d) => {
          totalExp += d.practiceTime / 10;
          return { ...d, totalExp: Math.round(totalExp) };
        });
      },

      getLearningStats: () => {
        const { skills, goals, records } = get();
        const today = new Date().toDateString();
        return {
          totalSkills: skills.length,
          maxLevelSkills: skills.filter((s) => s.level === s.maxLevel).length,
          totalGoals: goals.length,
          completedGoals: goals.filter((g) => g.status === 'completed').length,
          totalPracticeTime: records.reduce((sum, r) => sum + r.duration, 0),
          todayPracticeTime: records
            .filter((r) => new Date(r.date).toDateString() === today)
            .reduce((sum, r) => sum + r.duration, 0),
        };
      },

      selectedSkillId: null,
      setSelectedSkillId: (id) => set({ selectedSkillId: id }),
    }),
    {
      name: 'lingma-learning-storage',
      partialize: (state) => ({
        skills: state.skills,
        goals: state.goals,
        records: state.records,
      }),
    }
  )
);
