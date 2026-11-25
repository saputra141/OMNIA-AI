package com.omnia.ai

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.ui.PlayerView
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun VideoGeneratorScreen(apiBaseUrl: String) {
    var prompt by remember { mutableStateOf("") }
    var isGenerating by remember { mutableStateOf(false) }
    var videoTasks by remember { mutableStateOf<List<VideoTask>>(emptyList()) }
    val scope = rememberCoroutineScope()

    // Fetch history
    LaunchedEffect(Unit) {
        // Implement logic to fetch history from API
    }

    Column(modifier = Modifier.padding(16.dp)) {
        Text("AI Video Generator", style = MaterialTheme.typography.headlineMedium)
        Spacer(modifier = Modifier.height(8.dp))
        
        OutlinedTextField(
            value = prompt,
            onValueChange = { prompt = it },
            label = { Text("Deskripsikan video yang ingin dibuat...") },
            modifier = Modifier.fillMaxWidth()
        )
        
        Button(
            onClick = {
                isGenerating = true
                // Launch API call logic here
            },
            enabled = prompt.isNotEmpty() && !isGenerating,
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
        ) {
            Text(if (isGenerating) "Generating..." else "Buat Video")
        }

        Divider(modifier = Modifier.padding(vertical = 16.dp))

        LazyColumn {
            items(videoTasks) { task ->
                VideoTaskCard(task)
            }
        }
    }
}

data class VideoTask(
    val id: String,
    val prompt: String,
    val status: String,
    val resultUrl: String?
)

@Composable
fun VideoTaskCard(task: VideoTask) {
    Card(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
        Column(modifier = Modifier.padding(8.dp)) {
            Text(task.prompt, style = MaterialTheme.typography.bodyLarge)
            Text("Status: ${task.status}", style = MaterialTheme.typography.bodySmall)
            
            if (task.status == "completed" && task.resultUrl != null) {
                VideoPlayer(url = task.resultUrl)
            }
        }
    }
}

@Composable
fun VideoPlayer(url: String) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val exoPlayer = remember {
        ExoPlayer.Builder(context).build().apply {
            setMediaItem(MediaItem.fromUri(url))
            prepare()
        }
    }

    AndroidView(
        factory = { ctx ->
            PlayerView(ctx).apply {
                player = exoPlayer
            }
        },
        modifier = Modifier.fillMaxWidth().height(200.dp).padding(top = 8.dp)
    )
    
    DisposableEffect(Unit) {
        onDispose { exoPlayer.release() }
    }
}
