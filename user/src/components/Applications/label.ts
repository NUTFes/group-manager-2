export const stageOptionLabels = [
  'applications.stageOptions.fields.ownEquipment',
  'applications.stageOptions.fields.bgm',
  'applications.stageOptions.fields.cameraPermission',
  'applications.stageOptions.fields.loudSound',
] as const;

// 団体申請フォームで表示するラベル
export const groupLabels = [
  'applications.group.fields.name',
  'applications.group.fields.projectName',
  'applications.group.fields.isInternational',
  'applications.group.fields.isExternal',
  'applications.group.fields.groupCategory',
  'applications.group.fields.activity',
] as const;

export const stageLabels = [
  'applications.stage.fields.date',
  'applications.stage.fields.sunnyFirst',
  'applications.stage.fields.sunnySecond',
  'applications.stage.fields.rainyFirst',
  'applications.stage.fields.rainySecond',
  'applications.stage.fields.prepTime',
  'applications.stage.fields.performTime',
  'applications.stage.fields.cleanupTime',
] as const;

export const publicRelationLabels = [
  'applications.publicRelations.fields.text',
  'applications.publicRelations.fields.announce',
  'applications.publicRelations.fields.image',
] as const;

export const viceRepresentativeLabels = [
  'applications.viceRepresentative.fields.isIndividual',
  'applications.viceRepresentative.fields.name',
  'applications.viceRepresentative.fields.studentId',
  'applications.viceRepresentative.fields.gradeId',
  'applications.viceRepresentative.fields.departmentId',
  'applications.viceRepresentative.fields.email',
  'applications.viceRepresentative.fields.tel',
] as const;

export const venueMapLabels = {
  pictureName: 'applications.venueMap.fields.picture',
};
