<template>
  <div class="main-content message-templates-page">
    <SubHeader pageTitle="メールテンプレート管理">
      <CommonButton
        iconName="add_circle"
        :on_click="openCreateModal"
        :disabled="isSaving"
      >
        新規作成
      </CommonButton>
    </SubHeader>

    <Card width="100%">
      <Table>
        <template v-slot:table-header>
          <th v-for="(header, index) in headers" :key="index">
            {{ header }}
          </th>
        </template>
        <template v-slot:table-body>
          <tr
            v-for="template in templates"
            :key="template.id"
            :class="{ selected: selectedTemplateId === template.id }"
            @click="selectTemplate(template)"
          >
            <td>{{ template.id }}</td>
            <td>{{ template.name }}</td>
            <td>{{ localeLabel(template.locale) }}</td>
            <td>{{ template.subject }}</td>
            <td>{{ template.updated_at | formatDate }}</td>
          </tr>
        </template>
      </Table>
    </Card>

    <EditModal
      v-if="isOpenDetailModal && selectedTemplate"
      title="メールテンプレート詳細"
      @close="closeDetailModal"
    >
      <template v-slot:form>
        <div class="template-detail-field">
          <h3>テンプレート名</h3>
          <p>{{ selectedTemplate.name }}</p>
        </div>
        <div class="template-detail-field">
          <h3>言語</h3>
          <p>{{ localeLabel(selectedTemplate.locale) }}</p>
        </div>
        <div class="template-detail-field">
          <h3>件名</h3>
          <p>{{ selectedTemplate.subject }}</p>
        </div>
        <div class="template-detail-field">
          <h3>本文</h3>
          <pre>{{ selectedTemplate.body }}</pre>
        </div>
      </template>
      <template v-slot:method>
        <div class="template-detail-actions">
          <CommonButton
            iconName="edit"
            :on_click="openEditModalFromDetail"
            :disabled="isSaving"
          >
            編集
          </CommonButton>
          <CommonButton
            iconName="content_copy"
            :on_click="openCopyModalFromDetail"
            :disabled="isSaving"
          >
            複製
          </CommonButton>
        </div>
      </template>
    </EditModal>

    <AddModal
      v-if="isOpenCreateModal"
      :title="createModalTitle"
      @close="closeTemplateModal"
    >
      <template v-slot:form>
        <div>
          <h3>テンプレート名</h3>
          <input v-model="form.name" placeholder="例: GM再提出依頼" />
        </div>
        <div>
          <h3>言語</h3>
          <select v-model="form.locale">
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <h3>件名</h3>
          <input v-model="form.subject" placeholder="件名を入力してください" />
        </div>
        <div class="modal-insert-buttons">
          <h3>差し込み</h3>
          <div class="insert-buttons">
            <button
              v-for="variable in templateVariables"
              :key="variable.key"
              type="button"
              @click="insertVariable(variable.key)"
            >
              {{ variable.label }}
            </button>
          </div>
        </div>
        <div>
          <h3>本文</h3>
          <textarea
            ref="bodyTextarea"
            v-model="form.body"
            rows="12"
            placeholder="本文を入力してください"
          />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton
          iconName="save"
          :on_click="saveTemplate"
          :disabled="isSaving"
        >
          保存
        </CommonButton>
      </template>
    </AddModal>

    <EditModal
      v-if="isOpenEditModal"
      title="メールテンプレート編集"
      @close="closeTemplateModal"
    >
      <template v-slot:form>
        <div>
          <h3>テンプレート名</h3>
          <input v-model="form.name" placeholder="例: GM再提出依頼" />
        </div>
        <div>
          <h3>言語</h3>
          <select v-model="form.locale">
            <option value="ja">日本語</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <h3>件名</h3>
          <input v-model="form.subject" placeholder="件名を入力してください" />
        </div>
        <div class="modal-insert-buttons">
          <h3>差し込み</h3>
          <div class="insert-buttons">
            <button
              v-for="variable in templateVariables"
              :key="variable.key"
              type="button"
              @click="insertVariable(variable.key)"
            >
              {{ variable.label }}
            </button>
          </div>
        </div>
        <div>
          <h3>本文</h3>
          <textarea
            ref="bodyTextarea"
            v-model="form.body"
            rows="12"
            placeholder="本文を入力してください"
          />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton
          iconName="save"
          :on_click="saveTemplate"
          :disabled="isSaving"
        >
          保存
        </CommonButton>
      </template>
    </EditModal>

    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ message }}
    </SnackBar>
  </div>
</template>

<script>
// TODO: この画面は再提出機能に統合予定の暫定管理画面。再提出機能側の導線が実装されたら移動または削除する。
export default {
  data() {
    return {
      headers: ["ID", "テンプレート名", "言語", "件名", "更新日時"],
      templates: [],
      selectedTemplateId: null,
      form: {
        id: null,
        locale: "ja",
        name: "",
        subject: "",
        body: "",
      },
      isOpenCreateModal: false,
      isOpenEditModal: false,
      isOpenDetailModal: false,
      isCopyCreateMode: false,
      isSaving: false,
      isOpenSnackBar: false,
      message: "",
      templateVariables: [
        { key: "group_name", label: "団体名" },
        { key: "user_name", label: "代表者名" },
      ],
    };
  },
  computed: {
    selectedTemplate() {
      return this.templates.find(
        (template) => template.id === this.selectedTemplateId
      );
    },
    createModalTitle() {
      return this.isCopyCreateMode
        ? "メールテンプレート複製"
        : "メールテンプレート作成";
    },
  },
  async asyncData({ $axios }) {
    const response = await $axios.$get("/api/v1/message_templates");
    return {
      templates: response.data || [],
    };
  },
  methods: {
    blankForm() {
      return {
        id: null,
        locale: "ja",
        name: "",
        subject: "",
        body: "",
      };
    },
    localeLabel(locale) {
      return locale === "en" ? "English" : "日本語";
    },
    selectTemplate(template) {
      this.selectedTemplateId = template.id;
      this.isOpenDetailModal = true;
    },
    setFormFromTemplate(template, id = template.id) {
      this.form = {
        id,
        locale: template.locale,
        name: template.name,
        subject: template.subject,
        body: template.body,
      };
    },
    openCreateModal() {
      this.selectedTemplateId = null;
      this.form = this.blankForm();
      this.isCopyCreateMode = false;
      this.isOpenDetailModal = false;
      this.isOpenCreateModal = true;
    },
    openEditModal() {
      if (!this.selectedTemplate) return;
      this.setFormFromTemplate(this.selectedTemplate);
      this.isOpenDetailModal = false;
      this.isOpenEditModal = true;
    },
    openEditModalFromDetail() {
      this.openEditModal();
    },
    async openCopyModal() {
      if (!this.selectedTemplate) return;

      try {
        const response = await this.$axios.$get(
          `/api/v1/message_templates/${this.selectedTemplate.id}/copy_source`
        );
        this.form = {
          id: null,
          locale: response.data.locale,
          name: response.data.name,
          subject: response.data.subject,
          body: response.data.body,
        };
        this.isCopyCreateMode = true;
        this.isOpenDetailModal = false;
        this.isOpenCreateModal = true;
      } catch (error) {
        this.openSnackBar("複製用の内容作成に失敗しました");
      }
    },
    async openCopyModalFromDetail() {
      await this.openCopyModal();
    },
    closeDetailModal() {
      if (this.isSaving) return;
      this.isOpenDetailModal = false;
    },
    closeTemplateModal() {
      if (this.isSaving) return;
      this.resetTemplateModal();
    },
    resetTemplateModal() {
      this.isOpenCreateModal = false;
      this.isOpenEditModal = false;
      this.isOpenDetailModal = false;
      this.isCopyCreateMode = false;
      this.form = this.blankForm();
    },
    startCreate() {
      this.selectedTemplateId = null;
      this.form = this.blankForm();
    },
    insertVariable(key) {
      const token = `{${key}}`;
      const textarea = this.$refs.bodyTextarea;
      if (!textarea) {
        this.form.body += token;
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      this.form.body =
        this.form.body.slice(0, start) + token + this.form.body.slice(end);

      this.$nextTick(() => {
        textarea.focus();
        textarea.selectionStart = start + token.length;
        textarea.selectionEnd = start + token.length;
      });
    },
    validateForm() {
      if (
        !this.form.name ||
        !this.form.locale ||
        !this.form.subject ||
        !this.form.body
      ) {
        this.openSnackBar("テンプレート名、言語、件名、本文を入力してください");
        return false;
      }
      return true;
    },
    async saveTemplate() {
      if (this.isSaving || !this.validateForm()) return;

      this.isSaving = true;
      try {
        const params = {
          locale: this.form.locale,
          name: this.form.name,
          subject: this.form.subject,
          body: this.form.body,
        };

        let savedTemplateId = this.form.id;

        if (this.form.id) {
          await this.$axios.$patch(
            `/api/v1/message_templates/${this.form.id}`,
            params
          );
          this.openSnackBar("テンプレートを更新しました");
        } else {
          const response = await this.$axios.$post(
            "/api/v1/message_templates",
            params
          );
          savedTemplateId = response.data.id;
          this.openSnackBar("テンプレートを作成しました");
        }

        await this.reloadTemplates(savedTemplateId);
        this.resetTemplateModal();
      } catch (error) {
        this.openSnackBar("テンプレートの保存に失敗しました");
      } finally {
        this.isSaving = false;
      }
    },
    async reloadTemplates(selectedTemplateId = this.form.id) {
      const response = await this.$axios.$get("/api/v1/message_templates");
      this.templates = response.data || [];
      const selected = this.templates.find(
        (template) => template.id === selectedTemplateId
      );
      if (selected) {
        this.selectedTemplateId = selected.id;
      } else {
        this.startCreate();
      }
    },
    openSnackBar(message) {
      this.message = message;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
  },
};
</script>

<style scoped>
.insert-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: auto;
  font-size: 13px;
  font-weight: 600;
}

.modal-insert-buttons {
  width: 500px;
}

.insert-buttons button {
  flex: 0 0 auto;
  min-height: 32px;
  padding: 6px 10px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background: #ffffff;
  color: var(--accent-7);
  cursor: pointer;
  white-space: nowrap;
}

.template-detail-field {
  width: 500px;
}

.template-detail-field p,
.template-detail-field pre {
  box-sizing: border-box;
  width: 500px;
  margin: 0;
  padding: 12px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  background: #ffffff;
  color: var(--accent-7);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.template-detail-field pre {
  max-height: 320px;
  overflow-y: auto;
}

.template-detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 640px) {
  .modal-insert-buttons,
  .template-detail-field,
  .template-detail-field p,
  .template-detail-field pre {
    width: 100%;
  }
}
</style>

<style>
.message-templates-page .normal-table tr:hover {
  transform: none;
  border: none;
  border-bottom: solid 1px var(--accent-2);
  box-shadow: none;
  background: rgba(0, 0, 0, 0.06);
}
</style>
