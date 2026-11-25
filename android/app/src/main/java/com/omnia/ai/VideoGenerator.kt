package com.omnia.ai

import retrofit2.http.Body
import retrofit2.http.POST

data class VideoRequest(val prompt: String)
data class VideoResponse(val video_url: String, val status: String)

interface VideoApiService {
    @POST("api/generate-video")
    suspend fun generateVideo(@Body request: VideoRequest): VideoResponse
}

// Logic untuk integrasi pemutar video (ExoPlayer) bisa ditambahkan di sini
