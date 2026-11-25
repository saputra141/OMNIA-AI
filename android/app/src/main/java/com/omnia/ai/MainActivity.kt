package com.omnia.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { OmniaApp() }
    }
}

@Composable
fun OmniaApp() {
    var prompt by remember { mutableStateOf("") }
    var selected by remember { mutableStateOf("Auto Router") }
    var status by remember { mutableStateOf("Hubungkan backend untuk mulai menggunakan AI.") }
    val models = listOf("Auto Router", "GPT", "Gemini", "DeepSeek", "GLM", "Grok", "Qwen")
    MaterialTheme(colorScheme = darkColorScheme(
        primary = Color(0xFF69AFFF), background = Color(0xFF07111F),
        surface = Color(0xFF102039)
    )) {
        Surface(Modifier.fillMaxSize(), color = Color(0xFF07111F)) {
            Column(Modifier.fillMaxSize().padding(20.dp)) {
                Text("OMNIA AI", fontSize = 27.sp, color = Color(0xFF80BFFF))
                Text("ONE APP · MULTIPLE AI MODELS", fontSize = 10.sp, color = Color.LightGray)
                Spacer(Modifier.height(24.dp))
                Text("Apa yang ingin kamu buat?", fontSize = 23.sp)
                Text("Pilih model AI atau biarkan Auto Router menentukan.", color = Color.LightGray)
                Spacer(Modifier.height(16.dp))
                Text("MODEL AI")
                var expanded by remember { mutableStateOf(false) }
                Box {
                    OutlinedButton(onClick = { expanded = true }) { Text(selected) }
                    DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                        models.forEach { model -> DropdownMenuItem(
                            text = { Text(model) }, onClick = { selected = model; expanded = false }
                        ) }
                    }
                }
                Spacer(Modifier.height(18.dp))
                OutlinedTextField(
                    value = prompt, onValueChange = { prompt = it },
                    modifier = Modifier.fillMaxWidth().height(150.dp),
                    placeholder = { Text("Tulis pertanyaan atau prompt video…") },
                    shape = RoundedCornerShape(16.dp)
                )
                Spacer(Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = { status = "Chat memerlukan URL backend dan autentikasi pengguna." }) { Text("AI Chat") }
                    OutlinedButton(onClick = { status = "Video render memerlukan provider video yang telah dikonfigurasi admin." }) { Text("AI Video") }
                }
                Spacer(Modifier.height(16.dp))
                Card(colors = CardDefaults.cardColors(containerColor = Color(0xFF102039))) {
                    Text(status, Modifier.padding(16.dp), color = Color(0xFFB9CBE0))
                }
                Spacer(Modifier.weight(1f))
                Text("OMNIA AI · Starter 0.1.0", color = Color.Gray, fontSize = 11.sp)
            }
        }
    }
}
