import { api } from 'boot/axios'

export const chat = (message, history) => {
    // 定义请求负载
    const payload = {
        message: message,   
        history: history,
        temperature: 0.5,
        max_new_tokens: 4096
    };
    return api.post('/chat', payload)
}
