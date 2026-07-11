<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="publicRelation.group.name"
      pageSubTitle="参加団体PR"
    >
      <CommonButton v-if="this.$role(this.roleID).public_relations.update" iconName="edit" :on_click="openEditModal">
        編集
      </CommonButton>
      <CommonButton v-if="this.$role(this.roleID).public_relations.delete" iconName="delete" :on_click="openDeleteModal">
        削除
      </CommonButton>
    </SubHeader>

    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
        </Row>
        <Row>
          <!--<img src='publicRelation.picture_name' />-->
          <VerticalTable>
            <tr>
              <th>ID</th>
              <td>{{ publicRelation.group.id }}</td>
            </tr>
            <tr>
              <th>参加団体</th>
              <td>{{ publicRelation.group.name }}</td>
            </tr>
            <tr>
              <th>PRイラスト</th>
              <td>
                <div v-if='publicRelation.picture_path === null'>未登録</div>
                <div v-else @click="DownloadPic(publicRelation.picture_path)">
                  <img :src="publicRelation.picture_path" referrerpolicy="no-referrer" />
                </div>
              </td>
            </tr>
            <tr>
              <th>PR文</th>
              <td>
                <div v-if='publicRelation.blurb === null'>未登録</div>
                <div v-else>{{ publicRelation.blurb }}</div>
              </td>
            </tr>
            <tr>
            <th>アナウンス希望</th>
             <td>
              <div v-if="publicRelation.is_announcement_requested">
                はい
              </div>
              <div v-else>
                いいえ
              </div>
             </td>
            </tr>

            <tr>
              <th>登録日時</th>
              <td>
                <div v-if='publicRelation.blurb === null'>未登録</div>
                <div v-else>{{ publicRelation.created_at | formatDate }}</div>
              </td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>
                <div v-if='publicRelation.blurb === null'>未登録</div>
                <div v-else>{{ publicRelation.updated_at | formatDate }}</div>
              </td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="参加団体PR申請の編集"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <input
            v-model="publicRelation.group.name"
            placeholder="入力してください"
          />
        </div>
        <div>
          <h3>PR画像</h3>
          <label>
            <input type="file" accept=".png, .jpg" @change="fileUpload" />
            <div v-if="isInvalidFile === true" style="color: red">
              ファイル形式は[.pngか.jpeg又は.jpg]にしてください
            </div>
            <div v-else-if="isFileCheck === true" style="color: red">
              ファイル名は「参加形式_団体名」の形式で入力してください
            </div>
          </label>
        </div>
        <div>
          <h3>文章</h3>
          <textarea v-model="publicRelation.blurb" placeholder="入力してください" />
        </div>
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :disabled="!isFile" :on_click="edit">
          {{buttonState}}
        </CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="参加団体PR申請の削除"
    >
      <template v-slot:method>
        <YesButton iconName="delete" :on_click="destroy">はい</YesButton>
        <NoButton iconName="close" :on_click="closeDeleteModal"
          >いいえ</NoButton
        >
      </template>
    </DeleteModal>
    <SnackBar v-if="isOpenSnackBar" @close="closeSnackBar">
      {{ snackMessage }}
    </SnackBar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { uploadImageToImgur } from "~/utils/imgur_upload";
export default {
  watchQuery: ["page"],
  data() {
    return {
      isOpenEditModal: false,
      isOpenDeleteModal: false,
      isOpenSnackBar: false,
      snackMessage: null,
      group_id: null,
      buttonState: "登録",
      isPush: { disabled: false },
      isInvalidFile: false,
      isFile: false,
      isFileCheck: false,
    };
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/public_relations/", "");
    const url = "/api/v1/get_public_relation_for_admin_view/" + routeId;
    const response = await $axios.$get(url);
    return {
      publicRelation: response.data[0],
      route: url,
    };
  },
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    DownloadPic(url) {
      window.location.href = url
    },
    openEditModal() {
      this.isOpenEditModal = false;
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
      this.isOpenDeleteModal = false;
      this.isOpenDeleteModal = true;
    },
    closeDeleteModal() {
      this.isOpenDeleteModal = false;
    },
    openSnackBar(snackMessage) {
      this.snackMessage = snackMessage;
      this.isOpenSnackBar = true;
      setTimeout(this.closeSnackBar, 2000);
    },
    closeSnackBar() {
      this.isOpenSnackBar = false;
    },
    async reload(id) {
      const url = "/api/v1/get_public_relation_for_admin_view/" + id;
      const res = await this.$axios.$get(url);
      this.publicRelation = res.data[0];
    },
    fileUpload(event) {
      this.files = event.target.files;
      if (this.files.length > 0) {
        const file = this.files[0];

        const validFileName = ["png", "jpeg", "jpg"];
        const fileName = file.name.split(".").pop().toLowerCase();
        this.isInvalidFile = !validFileName.includes(fileName);
        const fileNameRegex = /^[^\\/:*?"<>|\r\n]+_[^\\/:*?"<>|\r\n]+$/;

        // ファイル形式のバリデーション
        if (this.isInvalidFile) {
          this.openSnackBar(
            "ファイル形式は[.pngか.jpeg又は.jpg]にしてください。"
          );
          this.isInvalidFile = true;
          return;
          // ファイル名のチェック。"_"で区切られているかどうかのチェック
        } else if (!fileNameRegex.test(file.name)) {
          this.openSnackBar(
            "ファイル名は「参加形式_団体名」の形式で入力してください"
          );
          this.isFileCheck = true;
          return;
        } else {
          this.isInvalidFile = false;
          this.isFileCheck = false;
          this.isFile = true;
        }
      }
    },
    async edit() {
      this.buttonState = "登録中";
      this.isPush.disabled = true;
      this.state = "Uploading ...";

      try {
        let pictureName = this.publicRelation.picture_name;
        let picturePath = this.publicRelation.picture_path;
        let imgurDeletehash = null;

        if (this.files && this.files.length > 0) {
          const file = this.files[0];
          const uploadedImage = await uploadImageToImgur(
            file,
            this.$config.imgurClientId
          );
          picturePath = uploadedImage.link;
          imgurDeletehash = uploadedImage.deletehash;
          pictureName = file.name;
        }

        const data = {
          group_id: this.publicRelation.group.id,
          picture_name: pictureName,
          picture_path: picturePath,
          blurb: this.publicRelation.blurb,
        };
        if (imgurDeletehash) {
          data.imgur_deletehash = imgurDeletehash;
        }

        if (this.publicRelation.public_relation_id) {
          //put
          const editUrl = `/public_relations/${this.publicRelation.public_relation_id}`;
          const response = await this.$axios.$put(editUrl, data);
          console.log(response);
          this.reload(response.data.group_id);
          this.closeEditModal();
          this.openSnackBar("参加団体PR申請を編集しました");
        } else {
          //post
          const postUrl = `/public_relations?group_id=${this.publicRelation.group.id}`;
          const response = await this.$axios.$post(postUrl, data);
          this.reload(response.data.group_id);
          this.closeEditModal();
          this.openSnackBar("参加団体PR申請を登録しました");
        }
        this.files = null;
      } catch (error) {
        console.log(error);
      } finally {
        this.buttonState = "登録";
        this.isPush.disabled = false;
        this.state = "";
      }
    },
    async destroy() {
      const delUrl = "/public_relations/" + this.publicRelation.public_relation_id;
      await this.$axios.$delete(delUrl);
      this.$router.push("/public_relations");
    },
  },
};
</script>

<style scoped>
td {
  width: 70%;
}
th {
  width: 30%;
}

img {
  width:100%;
  height: 100%;
  object-fit: contain;
}
</style>
