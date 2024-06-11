<template>
  <div class="main-content">
    <SubHeader
      v-bind:pageTitle="venue_map.group.name"
      pageSubTitle="模擬店平面図申請一覧"
    >
      <CommonButton
        v-if="this.$role(this.roleID).venue_maps.update"
        iconName="edit"
        :on_click="openEditModal"
      >
        編集
      </CommonButton>
      <CommonButton
        v-if="this.$role(this.roleID).venue_maps.delete"
        iconName="delete"
        :on_click="openDeleteModal"
      >
        削除
      </CommonButton>
    </SubHeader>
    <Row>
      <Card padding="40px 150px" gap="20px">
        <Row justify="start">
          <h4>基本情報</h4>
          <VerticalTable>
            <tr>
              <th>ID</th>
              <td>{{ venue_map.group.id }}</td>
            </tr>
            <tr>
              <th>参加団体</th>
              <td>{{ venue_map.group.name }}</td>
            </tr>
            <tr>
              <th>模擬店平面図</th>
              <td>
                <div v-if="venue_map.venue_map === null">未登録</div>
                <div v-else>
                  <img
                    :src="venue_map.venue_map.picture_path"
                    style="width: 40%; height: 40%"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <th>登録日時</th>
              <td>
                <div v-if="venue_map.venue_map === null">未登録</div>
                <div v-else>
                  {{ venue_map.venue_map.created_at | formatDate }}
                </div>
              </td>
            </tr>
            <tr>
              <th>編集日時</th>
              <td>
                <div v-if="venue_map.venue_map === null">未登録</div>
                <div v-else>
                  {{ venue_map.venue_map.updated_at | formatDate }}
                </div>
              </td>
            </tr>
          </VerticalTable>
        </Row>
      </Card>
    </Row>

    <EditModal
      @close="closeEditModal"
      v-if="isOpenEditModal"
      title="模擬店平面図の編集"
    >
      <template v-slot:form>
        <div>
          <h3>団体名</h3>
          <input
            v-model="venue_map.group.name"
            placeholder="入力してください"
          />
        </div>
        <div>
          <h3>模擬店平面図</h3>
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
      </template>
      <template v-slot:method>
        <CommonButton iconName="edit" :disabled="!isFile" :on_click="edit">{{
          buttonState
        }}</CommonButton>
      </template>
    </EditModal>

    <DeleteModal
      @close="closeDeleteModal"
      v-if="isOpenDeleteModal"
      title="模擬店平面図の削除"
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
  computed: {
    ...mapState({
      roleID: (state) => state.users.role,
    }),
  },
  async asyncData({ $axios, route }) {
    const routeId = route.path.replace("/venue_maps/", "");
    const url = "/api/v1/get_venue_map_for_admin_view/" + routeId;
    const res = await $axios.$get(url);
    return {
      venue_map: res.data[0],
      route: url,
    };
  },
  methods: {
    openEditModal() {
      this.isOpenEditModal = true;
    },
    closeEditModal() {
      this.isOpenEditModal = false;
    },
    openDeleteModal() {
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
      const url = "/api/v1/get_venue_map_for_admin_view/" + id;
      const res = await this.$axios.$get(url);
      this.venue_map = res.data[0];
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
    edit() {
      for (let f of this.files) {
        let storageRef = ref(this.$storage, f.name);
        let uploadTask = uploadBytesResumable(storageRef, f);
        this.run(uploadTask);
      }
    },
    run(uploadTask) {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let progress = snapshot.bytesTransferred / snapshot.totalBytes;
          this.progress = progress * 100;
          switch (snapshot.state) {
            case "paused":
              this.buttonState = "待機";
              this.isPush.disabled = true;
              this.state = "paused";
              break;
            case "running":
              this.buttonState = "待機";
              this.isPush.disabled = true;
              this.state = "Uploading ... (" + this.progress.toFixed() + "%)";
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const data = {
              group_id: this.venue_map.group.id,
              picture_name: uploadTask.snapshot.ref.name,
              picture_path: downloadURL,
            };

            if (this.venue_map.venue_map) {
              //put
              const editUrl = `/venue_maps/${this.venue_map.venue_map.id}`;
              this.$axios.$put(editUrl, data).then((response) => {
                this.reload(response.data.group_id);
                this.closeEditModal();
                this.openSnackBar("模擬店平面図を編集しました");
                this.isPush.disabled = false;
                this.files = null;
              });
            } else {
              //post
              const postUrl = `/venue_maps?group_id=${this.venue_map.group.id}`;
              this.$axios.$post(postUrl, data).then((response) => {
                this.reload(response.data.group_id);
                this.closeEditModal();
                this.openSnackBar("模擬店平面図を登録しました");
                this.isPush.disabled = false;
                this.files = null;
              });
            }
          });
        }
      );
    },
    async destroy() {
      const delUrl = "/venue_maps/" + this.venue_map.venue_map.id;
      await this.$axios.$delete(delUrl);
      this.$router.push("/venue_maps");
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
</style>

<style>
.common-button[disabled] {
  pointer-events: none;
  opacity: 0.6;
}
</style>
