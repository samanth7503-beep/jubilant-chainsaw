# Phase 2 Implementation Plan - Q2 2026

## Overview
Phase 2 focuses on building multilingual support infrastructure and adding the first two new languages (Tamil and Telugu).

## Timeline: 6-8 weeks (May 20 - July 10, 2026)

---

## Deliverables by Week

### Week 1-2: Language Detection & Infrastructure
- ✅ Language detection service (character-based heuristics)
- ✅ Language API service wrapper
- ✅ API endpoints for language operations
- ✅ React hooks for language operations

**Completed Files:**
- `lib/languages/src/language-detection.ts` - Detection logic
- `artifacts/api-server/src/lib/language-service.ts` - Service wrapper
- `artifacts/api-server/src/routes/language/index.ts` - API endpoints
- `artifacts/cortex/src/hooks/use-language.ts` - React hooks

**API Endpoints Ready:**
- `POST /api/language/detect` - Detect language from text
- `POST /api/language/translate` - Translate content
- `GET /api/language/supported` - Get supported languages
- `POST /api/language/content` - Generate content in specific language

### Week 3-4: Gemini API Integration
**Tasks:**
- [ ] Integrate Gemini API for language detection
- [ ] Implement translation using Gemini prompts
- [ ] Add content generation in target language
- [ ] Test with EN/HI before expanding

**Files to Update:**
- `lib/languages/src/language-detection.ts` - Add Gemini detection
- `artifacts/api-server/src/lib/language-service.ts` - Add Gemini translation

**Testing:**
- [ ] Unit tests for language detection
- [ ] Integration tests with Gemini API
- [ ] Load testing for rate limits

### Week 5-6: Tamil (TA) Support
**Tasks:**
- [ ] Add Tamil language metadata
- [ ] Create Tamil UI translations
- [ ] Set up Tamil curriculum data
- [ ] Test Tamil detection and translation
- [ ] Add Tamil to supported languages

**Curriculum Data to Create:**
- Biology curriculum (10th grade - Tamil board)
- Mathematics curriculum (10th grade - Tamil board)
- History/Social Science curriculum

**Files to Create:**
- `lib/db/seeds/tamil-syllabus.ts` - Tamil curriculum
- `lib/languages/src/ui-strings-ta.ts` - Tamil translations

### Week 7-8: Telugu (TE) Support + Testing & Documentation
**Tasks:**
- [ ] Add Telugu language metadata
- [ ] Create Telugu UI translations
- [ ] Set up Telugu curriculum data
- [ ] End-to-end testing
- [ ] Documentation and guides

**Curriculum Data to Create:**
- Biology curriculum (10th grade - Telugu board)
- Mathematics curriculum (10th grade - Telugu board)

**Files to Create:**
- `lib/db/seeds/telugu-syllabus.ts` - Telugu curriculum
- `lib/languages/src/ui-strings-te.ts` - Telugu translations

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│           Frontend (React)                   │
│  ┌───────────────────────────────────────┐  │
│  │ useLanguageDetection()                │  │
│  │ useTranslation()                      │  │
│  │ useSupportedLanguages()               │  │
│  │ useLanguagePreference()               │  │
│  └───────────────────────────────────────┘  │
└──────────────┬────────────────────────────┘
               │
        ┌──────▼──────────────────┐
        │  API Layer              │
        │ /api/language/*         │
        └──────┬──────────────────┘
               │
        ┌──────▼────────────────────────┐
        │  Language Service             │
        │ (Detection, Translation)      │
        └──────┬────────────────────────┘
               │
    ┌──────────┴──────────────┐
    ▼                         ▼
┌────────────┐         ┌──────────────┐
│ Gemini API │         │ Bhashini API │
│ (Current)  │         │ (Phase 3)    │
└────────────┘         └──────────────┘
```

---

## Implementation Details

### 1. Language Detection Service
**Status:** ✅ Implemented

Uses character-based Unicode range detection:
- Devanagari: Hindi, Marathi
- Tamil: தமிழ் script
- Telugu: తెలుగు script
- Bengali: বাংলা script
- Gujarati: ગુજરાતી script
- Kannada: ಕನ್ನಡ script
- Malayalam: മലയാളം script
- Odia: ଓଡ଼ିଆ script

Fallback to Gemini API for complex cases.

### 2. Translation Service
**Status:** 🔄 In Progress

**Current:** Gemini API prompts prepared
**TODO:** Implement actual Gemini API calls

Gemini Translation Prompt Template:
```
Translate the following text from [SOURCE_LANG] to [TARGET_LANG].
Preserve meaning and context.
Respond with ONLY the translation, no additional text.

Text: "[TEXT]"
```

### 3. Content Generation
**Status:** 🔄 In Progress

Gemini Content Generation Prompt Template:
```
You are an expert educator for Indian students.
Generate educational content about "[TOPIC]" in [TARGET_LANG].
Include:
1. Simple explanation
2. Real-world examples
3. Key concepts
4. Practice questions

Format: Clear paragraphs, easy to understand.
Grade Level: 10th grade
Language: [TARGET_LANG]
```

---

## Database Schema Updates

### New Curriculum Tables (to be seeded)
```sql
-- Tamil Curriculum
INSERT INTO curricula (lang_code, board, subject, grade, topics)
VALUES ('ta', 'Tamil Nadu', 'Biology', 10, [...]);

-- Telugu Curriculum
INSERT INTO curricula (lang_code, board, subject, grade, topics)
VALUES ('te', 'Telangana', 'Biology', 10, [...]);
```

---

## Testing Strategy

### Unit Tests
- Language detection accuracy
- Unicode range matching
- Confidence score calculation

### Integration Tests
- Gemini API calls
- Translation accuracy
- Content generation quality

### End-to-End Tests
- User sets language preference
- Detects input language
- Translates content
- Generates responses in target language

### Performance Tests
- Language detection latency < 100ms
- Translation latency < 500ms
- API throughput: 60 req/min (Gemini free tier)

---

## Dependency Tree

```
lib/languages/
├── src/
│   ├── index.ts (language definitions)
│   ├── language-detection.ts ✅
│   ├── ui-strings.ts (EN/HI)
│   ├── ui-strings-ta.ts (TODO)
│   ├── ui-strings-te.ts (TODO)
│   └── exports.ts
│
artifacts/api-server/
├── src/
│   ├── lib/
│   │   └── language-service.ts ✅
│   └── routes/
│       └── language/ ✅
│           ├── index.ts
│           └── translation.ts (TODO)
│
artifacts/cortex/
└── src/
    └── hooks/
        └── use-language.ts ✅
```

---

## Success Criteria

### Week 2 (Infrastructure Complete)
- ✅ Language detection working for all 12 languages
- ✅ API endpoints tested and documented
- ✅ React hooks ready for use

### Week 4 (Gemini Integration)
- [ ] Translation working EN↔HI
- [ ] Content generation in both languages
- [ ] Error handling and fallbacks

### Week 6 (Tamil Support)
- [ ] Tamil detection working
- [ ] Tamil translation EN↔TA
- [ ] Tamil curriculum seeded
- [ ] Tamil UI strings complete

### Week 8 (Telugu Support + Polish)
- [ ] Telugu detection working
- [ ] Telugu translation EN↔TE
- [ ] Telugu curriculum seeded
- [ ] Full end-to-end testing
- [ ] Documentation complete

---

## Known Limitations & TODOs

### Current Phase 2
- [ ] Character-based detection only (no ML yet)
- [ ] Translation is placeholder (no Gemini API calls yet)
- [ ] No speech-to-text yet (will be Phase 3)
- [ ] No text-to-speech yet (will be Phase 3)

### Phase 3 (Q3 2026) - Future
- [ ] Integrate Bhashini API for ASR/TTS
- [ ] Machine translation quality improvements
- [ ] Add Marathi + Bengali
- [ ] Implement caching for translations
- [ ] Add language-specific formatting

### Phase 4 (Q4 2026+) - Remaining Languages
- [ ] Kannada, Malayalam, Gujarati, Odia, Punjabi, Assamese

---

## Risk Mitigation

### Rate Limiting (Gemini Free Tier)
- **Limit:** 60 req/min, 1500 req/day
- **Mitigation:** 
  - Implement request queuing
  - Cache translations
  - Use heuristic detection first

### Translation Quality
- **Risk:** Low-quality translations
- **Mitigation:**
  - Start with well-known phrases
  - Manual review for curriculum
  - Fallback to English

### Character Encoding
- **Risk:** Unicode handling issues
- **Mitigation:**
  - Comprehensive regex patterns
  - Testing with native speakers
  - Input validation

---

## Rollout Plan

### Alpha (Week 6)
- Internal testing with Tamil support
- Feedback from Tamil-speaking team members

### Beta (Week 7)
- Release to limited user group
- Monitor detection accuracy
- Gather feedback

### Production (Week 8)
- Full rollout of Phase 2
- Monitor API usage and errors
- Prepare for Phase 3

---

## Communication Plan

### Week 2
- Share infrastructure updates
- Demo API endpoints
- Request feedback

### Week 4
- Announce Gemini integration
- Performance metrics

### Week 6-8
- Tamil support beta
- Telugu support announcement
- Celebrate 4-language milestone

---

## Resource Requirements

### APIs
- ✅ Gemini API key (already configured)
- ⏳ Bhashini API (Phase 3)
- ⏳ Google Cloud Translate (optional backup)

### Data
- Tamil curriculum data (sourcing needed)
- Telugu curriculum data (sourcing needed)
- Native speaker for QA

### Infrastructure
- Current: None additional needed
- Phase 3: Speech recognition service
- Phase 3: Text-to-speech service

---

## Metrics to Track

### Quality
- Language detection accuracy > 90%
- Translation confidence > 0.8
- User satisfaction with translations

### Performance
- API response time < 500ms
- Language detection < 100ms
- Zero 429 rate limit errors

### Usage
- Daily active users per language
- Content generation requests
- Translation requests
- Language detection calls

---

## Next Steps (Starting Next Week)

1. **Implement Gemini API Calls** 
   - Replace placeholder implementations
   - Add error handling

2. **Build Tamil Support**
   - Create Tamil curriculum seed data
   - Add Tamil UI translations
   - Testing with Tamil speakers

3. **Setup Monitoring**
   - API performance tracking
   - Error rate monitoring
   - Usage analytics

4. **Documentation**
   - API documentation
   - Implementation guides
   - User guides for new languages

---

**Phase 2 Kick-off:** May 20, 2026  
**Phase 2 Completion Target:** July 10, 2026  
**Next Milestone:** 4 languages (EN, HI, TA, TE)
