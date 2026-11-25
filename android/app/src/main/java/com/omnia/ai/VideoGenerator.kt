package com.omnia.ai

import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class VideoGenerator(private val baseUrl: String) {
    private val client = OkHttpClient()

    fun createVideoTask(
        prompt: String,
        provider: String,
        callback: (Boolean, String?) -> Unit
    ) {
        val json = JSONObject().apply {
            put("prompt", prompt)
            put("provider", provider)
        }

        val body = json.toString()
            .toRequestBody("application/json; charset=utf-8".toMediaType())

        val request = Request.Builder()
            .url("${baseUrl.trimEnd('/')}/api/tasks")
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback(false, e.localizedMessage ?: "Network request failed")
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    val responseText = it.body?.string().orEmpty()

                    if (!it.isSuccessful) {
                        callback(
                            false,
                            "Server error ${it.code}: ${responseText.ifBlank { it.message }}"
                        )
                        return
                    }

                    try {
                        val taskId = JSONObject(responseText).optString("id")
                        if (taskId.isBlank()) {
                            callback(false, "Server response does not contain a task ID")
                        } else {
                            callback(true, taskId)
                        }
                    } catch (_: JSONException) {
                        callback(false, "Server returned an invalid JSON response")
                    }
                }
            }
        })
    }
}
