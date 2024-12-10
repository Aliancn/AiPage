<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card style="width: 90%">
      <q-card-section class="row justify-between items-center bg-primary text-white">
        <div>AI Chat Assistant</div>
      </q-card-section>

      <q-card-section>
        <div ref="chatBox" class="chat-box" style="height: 400px; overflow-y: auto; padding: 10px">
          <!-- 循环显示消息 -->
          <div
            v-for="message in messages"
            :key="message.id"
            class="message-row"
            :class="{ 'user-row': message.sender === 'user', 'ai-row': message.sender === 'ai' }"
          >
            <!-- 头像 -->
            <Avatar
              :src="message.sender === 'user' ? userAvatar : aiAvatar"
              :alt="message.sender === 'user' ? 'User Avatar' : 'AI Avatar'"
            />
            <!-- 消息文本 -->
            <q-chip
              :color="message.sender === 'user' ? 'blue' : 'green'"
              outline
              class="message-text"
            >
              <q-markdown class="q-pt-md q-ma-md text-center" :src="message.text"></q-markdown>
            </q-chip>
          </div>

          <!-- 显示AI消息的选项按钮 -->
          <div v-if="optionShow" class="options q-pa-sm q-gutter-sm">
            <q-btn
              v-for="(option, index) in currentOptions"
              :key="index"
              :label="option"
              :size="'sm'"
              @click="handleOption(option)"
              color="secondary"
              class=""
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="inputText"
          placeholder="Enter your message..."
          @keyup.enter="sendMessage"
        />
        <q-btn label="Send" @click="sendMessage" class="q-mt-md" color="primary" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import Avatar from 'components/AvatarSample.vue'
import userAvatar from 'assets/user.png'
import aiAvatar from 'assets/ai.png'
import { chat } from 'boot/api.js'
export default {
  components: {
    Avatar,
  },
  data() {
    return {
      messages: [
        {
          id: 1,
          sender: 'ai',
          // text: 'Hello, how can I assist **you** today?',
          text: `
Here is a **Markdown table**:

| Name       | Age | Country  |
|------------|-----|----------|
| Alice      | 25  | USA      |
| Bob        | 30  | Canada   |
| Charlie    | 35  | UK       |

Enjoy using tables in Markdown!`,
          options: ['Ask about product features', 'Check order status', 'Talk to customer support'],
        },
      ],
      inputText: '',
      optionShow: false,
      currentOptions: [],
      userAvatar: userAvatar, // 用户头像链接
      aiAvatar: aiAvatar, // AI 头像链接
    }
  },
  methods: {
    extractDialogues(text) {
      const regex = /<\|assistant\|>(.*?)<\|user\|>/gs
      let matches
      const dialogues = []

      while ((matches = regex.exec(text)) !== null) {
        dialogues.push(matches[1].trim())
      }

      return dialogues
    },
    sendMessage() {
      if (this.inputText.trim()) {
        let input = this.inputText
        this.optionShow = false
        const userMessage = { id: Date.now(), sender: 'user', text: this.inputText }
        this.messages.push(userMessage)
        // 滚动到最新消息
        this.scrollToBottom()

        // Simulate AI response
        // setTimeout(() => {
        //   const aiResponse = {
        //     id: Date.now(),
        //     sender: 'ai',
        //     text: 'You asked: "' + input + '". How can I further assist?',
        //     options: ['More details', 'Another question', 'Goodbye'],
        //   }

        //   chat(input, [])
        //     .then((res) => {
        //       aiResponse.text = res.data.response
        //       console.log(res.data.response)
        //     })
        //     .catch((err) => {
        //       console.log(err)
        //     })

        //   this.messages.push(aiResponse)

        //   // Set available options for the next AI response
        //   this.currentOptions = aiResponse.options
        //   this.optionShow = true
        //   // 滚动到最新消息
        //   this.scrollToBottom()
        // }, 1000)

        const aiResponse = {
          id: Date.now(),
          sender: 'ai',
          text: 'You asked: "' + input + '". How can I further assist?',
          options: ['More details', 'Another question', 'Goodbye'],
        }

        chat(input, [])
          .then((res) => {

            // 去除多余部分
            aiResponse.text = this.extractDialogues(res.data.response).join('\n')

            this.messages.push(aiResponse)

            // Set available options for the next AI response
            this.currentOptions = aiResponse.options
            this.optionShow = true

            // 滚动到最新消息
            this.scrollToBottom()
          })
          .catch((err) => {
            console.log(err)
          })
        this.inputText = ''
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBox = this.$refs.chatBox
        chatBox.scrollTop = chatBox.scrollHeight
      })
    },
    handleOption(option) {
      this.optionShow = false
      // Handle option selection (you can add different behavior based on the selected option)
      const optionMessage = { id: Date.now(), sender: 'user', text: option }
      this.messages.push(optionMessage)

      // Simulate a response from AI based on selected option
      setTimeout(() => {
        const aiResponse = {
          id: Date.now(),
          sender: 'ai',
          text: `You selected: "${option}". How can I assist you further?`,
          options: ['More help', 'Start over'],
        }
        this.messages.push(aiResponse)
        this.currentOptions = aiResponse.options
        this.optionShow = true
      }, 1000)
    },
  },
}
</script>

<style>
.chat-box {
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px; /* 消息之间的间隔 */
  overflow-y: auto;
}

/* 消息行样式 */
.message-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}
/* 用户消息在右侧 */
.user-row {
  flex-direction: row-reverse;
  text-align: right;
}

/* AI 消息在左侧 */
.ai-row {
  flex-direction: row;
  text-align: left;
}

/* 头像样式 */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
}

/* 消息文本样式 */
.message-text {
  max-width: 70%; /* 限制消息框宽度 */
  height: auto;
  word-wrap: break-word;
  background-color: #ffffff; /* 背景颜色 */
  border: 1px solid #e0e0e0; /* 边框颜色 */
  border-radius: 8px;
  padding: 10px;
  overflow-x: auto; /*确保表格内容可横向滚动 */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* 添加轻微阴影 */
}

/* Markdown 表格样式 */
.message-text table {
  width: 100%; /* 表格宽度占满容器 */
  border-collapse: collapse;
  margin-top: 5px;
}

.options {
  /* display: flex; */
  flex-direction: column;
  /* margin-top: 10px;  */
  margin-left: 20px;
  padding-left: 30px;
}
</style>
