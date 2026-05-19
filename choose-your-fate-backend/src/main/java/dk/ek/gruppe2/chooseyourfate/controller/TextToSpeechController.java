package dk.ek.gruppe2.chooseyourfate.controller;

import dk.ek.gruppe2.chooseyourfate.service.TTSService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("choose-your-fate/tts")
public class TextToSpeechController {

    TTSService ttsService;

    public TextToSpeechController(TTSService ttsService) {
        this.ttsService = ttsService;
    }
    @PostMapping("/test")
    public ResponseEntity<byte[]> textToSpeech(@RequestBody String text) throws IOException {
        byte[] bytes = ttsService.textToSpeech(text);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"speech.mp3\"")
                .body(bytes);
    }

}
