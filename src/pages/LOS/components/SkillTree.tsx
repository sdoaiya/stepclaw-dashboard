import { Card, Progress, Tag, Button, Empty, Row, Col } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  TrophyOutlined,
  StarOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { SKILL_LEVELS } from '@/utils/constants';
import type { Skill } from '@/types';

interface SkillTreeProps {
  skills: Skill[];
  selectedSkillId: string | null;
  onSelect: (id: string | null) => void;
}

export default function SkillTree({ skills, selectedSkillId, onSelect }: SkillTreeProps) {
  const getLevelInfo = (level: number) => {
    return SKILL_LEVELS.find((l) => l.level === level) || SKILL_LEVELS[0];
  };

  const selectedSkill = selectedSkillId ? skills.find((s) => s.id === selectedSkillId) : null;

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <Row gutter={[16, 16]}>
      {/* Skill List */}
      <Col xs={24} lg={16}>
        <Row gutter={[16, 16]}>
          {categories.map((category) => (
            <Col xs={24} key={category}>
              <Card
                title={category}
                size="small"
                className="bg-gray-50"
              >
                <Row gutter={[12, 12]}>
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => {
                      const levelInfo = getLevelInfo(skill.level);
                      const isMaxLevel = skill.level === skill.maxLevel;
                      const isSelected = skill.id === selectedSkillId;

                      return (
                        <Col xs={24} sm={12} md={8} key={skill.id}>
                          <Card
                            size="small"
                            className={`cursor-pointer transition-all ${
                              isSelected ? 'ring-2 ring-purple-400' : ''
                            } ${isMaxLevel ? 'border-yellow-400' : ''}`}
                            onClick={() => onSelect(skill.id)}
                            hoverable
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="font-medium">{skill.name}</div>
                              {isMaxLevel && (
                                <TrophyOutlined className="text-yellow-500" />
                              )}
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                              <Tag
                                color={levelInfo.color}
                                className="text-xs"
                              >
                                Lv.{skill.level} {levelInfo.label}
                              </Tag>
                              <span className="text-xs text-gray-400">
                                {skill.practiceCount}次练习
                              </span>
                            </div>

                            <Progress
                              percent={Math.round(
                                (skill.currentExp / skill.requiredExp) * 100
                              )}
                              size="small"
                              strokeColor={levelInfo.color}
                              showInfo={false}
                            />

                            <div className="flex justify-between text-xs mt-1">
                              <span className="text-gray-400">
                                {skill.currentExp}/{skill.requiredExp} XP
                              </span>
                              {skill.lastPracticedAt && (
                                <FireOutlined className="text-orange-500" />
                              )}
                            </div>
                          </Card>
                        </Col>
                      );
                    })}
                </Row>
              </Card>
            </Col>
          ))}

          {skills.length === 0 && (
            <Col xs={24}>
              <Empty description="暂无技能，点击添加技能开始记录" />
            </Col>
          )}
        </Row>
      </Col>

      {/* Skill Detail */}
      <Col xs={24} lg={8}>
        {selectedSkill ? (
          <Card
            title="技能详情"
            extra={
              <Button type="text" icon={<EditOutlined />}>
                编辑
              </Button>
            }
          >
            <div className="text-center mb-4">
              <div className="text-2xl font-bold mb-2">{selectedSkill.name}</div>
              <Tag>{selectedSkill.category}</Tag>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>当前等级</span>
                <span className="font-medium">
                  Lv.{selectedSkill.level} {getLevelInfo(selectedSkill.level).label}
                </span>
              </div>
              <Progress
                percent={Math.round(
                  (selectedSkill.currentExp / selectedSkill.requiredExp) * 100
                )}
                strokeColor={getLevelInfo(selectedSkill.level).color}
                format={() => `${selectedSkill.currentExp}/${selectedSkill.requiredExp}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-purple-500">
                  {selectedSkill.practiceCount}
                </div>
                <div className="text-xs text-gray-400">练习次数</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold text-orange-500">
                  {selectedSkill.maxLevel}
                </div>
                <div className="text-xs text-gray-400">最高等级</div>
              </div>
            </div>

            {selectedSkill.description && (
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">描述</div>
                <div className="text-sm">{selectedSkill.description}</div>
              </div>
            )}

            {selectedSkill.learnedAt && (
              <div className="text-xs text-gray-400">
                开始学习: {selectedSkill.learnedAt}
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <Empty description="选择技能查看详情" />
          </Card>
        )}
      </Col>
    </Row>
  );
}
