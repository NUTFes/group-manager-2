<template>
  <div class="main-content message-templates-page">
    <SubHeader pageTitle="メールテンプレート管理" />

    <div class="template-layout">
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

      <section class="editor-panel">
        <div class="editor-panel__header">
          <h3>{{ form.id ? "テンプレート編集" : "テンプレート作成" }}</h3>
          <div class="editor-panel__actions">
            <CommonButton
              iconName="restart_alt"
              :on_click="startCreate"
              :disabled="isSaving"
            >
              リセット
            </CommonButton>
            <CommonButton
              iconName="content_copy"
              :on_click="copySource"
              :disabled="!form.id || isSaving"
            >
              複製
            </CommonButton>
            <CommonButton
              iconName="save"
              :on_click="saveTemplate"
              :disabled="isSaving"
            >
              保存
            </CommonButton>
          </div>
        </div>

        <div class="form-grid">
          <label>
            <span>テンプレート名</span>
            <input v-model="form.name" placeholder="例: GM再提出依頼" />
          </label>

          <label>
            <span>言語</span>
            <select v-model="form.locale">
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>

        <label>
          <span>件名</span>
          <input v-model="form.subject" placeholder="件名を入力してください" />
        </label>

        <div class="insert-buttons">
          <span>差し込み</span>
          <button
            v-for="variable in templateVariables"
            :key="variable.key"
            type="button"
            @click="insertVariable(variable.key)"
          >
            {{ variable.label }}
          </button>
        </div>

        <label>
          <span>本文</span>
          <textarea
            ref="bodyTextarea"
            v-model="form.body"
            rows="18"
            placeholder="本文を入力してください"
          />
        </label>
      </section>
    </div>

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
      isSaving: false,
      isOpenSnackBar: false,
      message: "",
      templateVariables: [
        { key: "group_name", label: "団体名" },
        { key: "user_name", label: "代表者名" },
        { key: "resubmit_memo", label: "再提出メモ" },
      ],
    };
  },
  async asyncData({ $axios }) {
    const response = await $axios.$get("/api/v1/message_templates");
    return {
      templates: response.data || [],
    };
  },
  mounted() {
    if (this.templates.length > 0) {
      this.selectTemplate(this.templates[0]);
    }
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
      this.form = {
        id: template.id,
        locale: template.locale,
        name: template.name,
        subject: template.subject,
        body: template.body,
      };
    },
    startCreate() {
      this.selectedTemplateId = null;
      this.form = this.blankForm();
    },
    async copySource() {
      if (!this.form.id) return;

      try {
        const response = await this.$axios.$get(
          `/api/v1/message_templates/${this.form.id}/copy_source`
        );
        this.selectedTemplateId = null;
        this.form = {
          id: null,
          locale: response.data.locale,
          name: response.data.name,
          subject: response.data.subject,
          body: response.data.body,
        };
        this.openSnackBar("複製用の内容を作成しました");
      } catch (error) {
        this.openSnackBar("複製用の内容作成に失敗しました");
      }
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
        this.selectTemplate(selected);
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
.template-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 520px);
  gap: 24px;
  width: 100%;
}

.editor-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
}

.editor-panel__header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
}

.editor-panel__header h3 {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
}

.editor-panel__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.form-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 160px;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
}

input,
select,
textarea {
  width: 100%;
  min-height: 42px;
  padding: 10px 12px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  color: var(--accent-7);
  font-size: 14px;
  letter-spacing: 0;
}

textarea {
  resize: vertical;
  line-height: 1.6;
  white-space: pre-wrap;
}

.insert-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 13px;
  font-weight: 600;
}

.insert-buttons button {
  min-height: 32px;
  padding: 6px 10px;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
}

@media (max-width: 1080px) {
  .template-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .editor-panel__header {
    align-items: flex-start;
    flex-direction: column;
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
