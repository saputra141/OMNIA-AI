package com.omnia.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme {
                var backendUrl by remember { mutableStateOf("") }
                var prompt by remember { mutableStateOf("") }
                var isSubmitting by remember { mutableStateOf(false) }
                var status by remember {
                    mutableStateOf("Masukkan URL Cloudflare Worker dan deskripsi video.")
                }

                Surface(modifier = Modifier.fillMaxSize()) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Text("OMNIA AI", style = MaterialTheme.typography.headlineLarge)
                        Text(
                            "AI workspace · Video task",
                            style = MaterialTheme.typography.bodyMedium
                        )

                        OutlinedTextField(
                            value = backendUrl,
                            onValueChange = { backendUrl = it },
                            modifier = Modifier.fillMaxWidth(),
                            label = { Text("Backend URL") },
                            placeholder = { Text("https://your-worker.workers.dev") },
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = prompt,
                            onValueChange = { prompt = it },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(150.dp),
                            label = { Text("Deskripsi video") },
                            placeholder = { Text("Jelaskan video yang ingin dibuat...") }
                        )

                        Button(
                            onClick = {
                                val url = backendUrl.trim().trimEnd('/')
                                val description = prompt.trim()

                                when {
                                    !url.startsWith("https://") -> {
                                        status = "Masukkan URL backend HTTPS yang valid."
                                    }
                                    description.isBlank() -> {
                                        status = "Deskripsi video tidak boleh kosong."
                                    }
                                    else -> {
                                        isSubmitting = true
                                        status = "Mengirim permintaan ke backend..."
                                        VideoGenerator(url).createVideoTask(
                                            description,
                                            "openai-sora"
                                        ) { success, result ->
                                            runOnUiThread {
                                                isSubmitting = false
                                                status = if (success) {
                                                    "Tugas berhasil dibuat. ID: ${result ?: "tidak tersedia"}"
                                                } else {
                                                    "Gagal membuat tugas: ${result ?: "Kesalahan tidak diketahui"}"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            enabled = !isSubmitting,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(if (isSubmitting) "Mengirim..." else "Buat tugas video")
                        }

                        Spacer(modifier = Modifier.height(4.dp))
                        Text(status, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}
