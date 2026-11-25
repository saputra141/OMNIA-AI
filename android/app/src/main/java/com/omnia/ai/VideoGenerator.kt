package com.omnia.ai

import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException

class VideoGenerator(private val baseUrl: String) {
    private val client = OkHttpClient()

    fun createVideoTask(prompt: String, provider: String, callback: (Boolean, String?) -> Unit) {
        val json = JSONObject().apply {
            put("prompt", prompt)
            put("provider", provider)
        }

        val body = json.toString().toRequestBody("application/json; charset=utf-8".toMediaType())
        val request = Request.Builder()
            .url("$baseUrl/api/tasks")
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback(false, e.message)
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val respData = response.body?.string()
                    val taskId = JSONObject(respData!!).getString("id")
                    callback(true, taskId)
                } else {
                    callback(false, "Server Error: ${response.code}")
                }
            }
        })
    }
}
