<template>
  <div>
    <v-row justify="center">
      <v-col
        sm="7"
        md="7"
        lg="7"
        xl="7"
      >
        <img        
          :src="preview"
        >
        <v-file-input
          v-model="file"
          @change="previewFile(file)"
        />
        <v-btn
          block
          color="blue"
          @click="submitFiles(file)"
        >
          추가
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import restAPI from "@/util/http-common.js";

export default {
  data:()=>({
    preview: '',
    saveFile: null,
    file:null
  }),
  methods:{
    previewFile(file){
      const fileData = (data) => {
        this.preview = data
      }
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.addEventListener("load", function () {
        fileData(reader.result)
      }, false);
    },

    submitFiles(file) {
    if (file) {
        let formData = new FormData();
        console.log(file);
        // files
        
        for (let f of file) {
            formData.append("files", f, f.name);
        }


            formData.append("files", file, file.name);
        
        // additional data
        //formData.append("test", "foo bar");
        

        restAPI
            .post("/api/upload", formData)
            .then(response => {
                console.log("Success!");
                console.log({ response });
            })
            .catch(error => {
                console.log({ error });
            });
    } else {
        console.log("there are no files.");
    }
}
  }
}
</script>
