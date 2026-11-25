package com.omnia.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    ChatScreen()
                }
            }
        }
    }
}

data class ChatRequest(val prompt: String, val provider: String = "openai")
data class ChatResponse(val response: String)

interface ApiService {
    @POST("api/chat")
    suspend fun sendMessage(@Body request: ChatRequest): ChatResponse
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen() {
    val scope = rememberCoroutineScope()
    var inputText by remember { mutableStateOf("") }
    val messages = remember { mutableStateListOf<Pair<String, Boolean>>() } // Boolean: true if user

    val api = remember {
        Retrofit.Builder()
            .baseUrl("https://your-worker-url.workers.dev/") // Ganti dengan URL Worker Anda
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        LazyColumn(modifier = Modifier.weight(1f)) {
            items(messages) { msg ->
                Card(
                    modifier = Modifier.padding(vertical = 4.dp).fillMaxWidth(0.8f),
                    colors = CardDefaults.cardColors(
                        containerColor = if (msg.second) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.secondaryContainer
                    )
                ) {
                    Text(text = msg.first, modifier = Modifier.padding(8.dp))
                }
            }
        }

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            TextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Ask OMNIA...") }
            )
            Button(onClick = {
                if (inputText.isNotBlank()) {
                    val userMsg = inputText
                    messages.add(userMsg to true)
                    inputText = ""
                    scope.launch {
                        try {
                            val res = api.sendMessage(ChatRequest(userMsg))
                            messages.add(res.response to false)
                        } catch (e: Exception) {
                            messages.add("Error: ${e.localizedMessage}" to false)
                        }
                    }
                }
            }) {
                Text("Send")
            }
        }
    }
}
