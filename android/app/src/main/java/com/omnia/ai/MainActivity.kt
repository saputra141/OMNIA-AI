package com.omnia.ai

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private lateinit var videoGenerator: VideoGenerator
    private val BACKEND_URL = "https://your-worker-url.workers.dev"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        videoGenerator = VideoGenerator(BACKEND_URL)

        val promptInput = findViewById<EditText>(R.id.promptInput)
        val generateBtn = findViewById<Button>(R.id.generateBtn)

        generateBtn.setOnClickListener {
            val prompt = promptInput.text.toString()
            if (prompt.isNotEmpty()) {
                generateBtn.isEnabled = false
                generateBtn.text = "Generating..."
                
                videoGenerator.createVideoTask(prompt, "openai-sora") { success, result ->
                    runOnUiThread {
                        generateBtn.isEnabled = true
                        generateBtn.text = "Generate Video"
                        if (success) {
                            Toast.makeText(this, "Task Created: $result", Toast.LENGTH_LONG).show()
                        } else {
                            Toast.makeText(this, "Error: $result", Toast.LENGTH_LONG).show()
                        }
                    }
                }
            }
        }
    }
}
