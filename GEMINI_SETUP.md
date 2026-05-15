# Gemini AI Integration Setup

This guide explains how to set up and use Google Gemini API with the Cortex AI platform.

## Getting Started with Gemini API

### Step 1: Get Your API Key

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with your Google account (create one if needed)
3. Click **"Create API Key"** button
4. Copy the generated key (e.g., `AIzaSyCGKHp0hNY2lrQVSdczSciU9esFFXISLc0`)

### Step 2: Add to Environment

Create or edit `.env` file:

```env
AI_INTEGRATIONS_GEMINI_API_KEY=AIzaSyCGKHp0hNY2lrQVSdczSciU9esFFXISLc0
AI_INTEGRATIONS_GEMINI_BASE_URL=https://generativelanguage.googleapis.com
```

### Step 3: Verify Setup

Run the server:

```bash
pnpm --filter @workspace/api-server run dev
```

You should see no errors related to missing Gemini API key.

---

## Gemini API Features Used

### Available Models

| Model | Cost | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| `gemini-2.5-flash` | Free tier | ⚡ Fast | Good | Real-time tutoring, explanations |
| `gemini-2.0-pro` | Free tier | Medium | Excellent | Complex analysis, advanced content |
| `gemini-1.5-pro` | Free tier | Slower | Best | Detailed responses, long context |

### Current Implementation

The platform uses **`gemini-2.5-flash`** for:
- Topic explanations
- Study plan generation
- Tutoring responses
- Content generation

---

## Free Tier Limits

```
Rate Limit: 60 requests per minute
Daily Limit: 1500 requests per day
Input Tokens: 1 million per day
Output Tokens: 1 million per day
```

**No credit card required** for free tier.

---

## Language Support

Gemini supports all 12 target languages for text generation:

```
✅ English (EN)
✅ Hindi (हिंदी)
📅 Tamil (தமிழ்)
📅 Telugu (తెలుగు)
📅 Marathi (मराठी)
📅 Bengali (বাংলা)
📅 Kannada (ಕನ್ನಡ)
📅 Malayalam (മലയാളം)
📅 Gujarati (ગુજરાતી)
📅 Odia (ଓଡ଼ିଆ)
📅 Punjabi (ਪੰਜਾਬੀ)
📅 Assamese (অসমীয়া)
```

---

## Using Gemini for Different Tasks

### 1. Topic Explanation

```typescript
const prompt = `Explain "Photosynthesis" in simple English for a 10th grade student. 
Include: what it is, why it's important, and key steps.`;
```

### 2. Study Plan Generation

```typescript
const prompt = `Create a 2-week study plan for "Biology Chapter 5: Genetics" 
for 9th grade. Format: Day-by-day breakdown with daily topics and practice problems.`;
```

### 3. Translation (Placeholder - Use Bhashini API)

```typescript
// Current: Gemini
// Future: Use Bhashini API for cost-effective translation
const prompt = `Translate this text from English to Hindi: 
"Hello, how are you today?"`;
```

---

## Migration Path to Bhashini (Optional)

For **cost optimization** and **better multilingual support**, consider migrating to Bhashini API:

| Aspect | Gemini | Bhashini |
|--------|--------|----------|
| Translation Cost | 0.5-2 USD per 1M chars | Free tier available |
| Language Support | 130+ | 22 Indian languages |
| ASR (Voice) | Available | Optimized for Indian languages |
| TTS (Text-to-Speech) | Available | Optimized for Indian languages |
| Setup Complexity | Easy | Moderate |

**Bhashini API**: https://bhashini.gov.in/

---

## Troubleshooting

### "GEMINI_API_KEY not set" Error

```
Error: AI_INTEGRATIONS_GEMINI_API_KEY must be set
```

**Solution**: 
1. Check `.env` file exists
2. Verify API key is pasted correctly (no spaces)
3. Restart development server after adding key

### Rate Limit Exceeded

```
Error: 429 Too Many Requests
```

**Solution**:
- Free tier: 60 requests/minute
- Wait a minute before retrying
- Consider upgrading to paid tier for higher limits
- Implement request queuing in production

### Invalid API Key

```
Error: 403 Forbidden - Invalid API key
```

**Solution**:
1. Generate a new key at https://aistudio.google.com/app/apikey
2. Verify it's not accidentally modified
3. Clear browser cache and try again

---

## Best Practices

### 1. Secure API Key Management

```bash
# ✅ Good - in .env file
AI_INTEGRATIONS_GEMINI_API_KEY=your-key-here

# ❌ Bad - hardcoded in source
const API_KEY = "AIzaSyCGKHp0hNY2lrQVSdczSciU9esFFXISLc0";

# ❌ Bad - committed to git
git add .env
git commit  # Will expose the key!
```

### 2. Error Handling

```typescript
try {
  const response = await geminiClient.generateContent(prompt);
} catch (error) {
  if (error.status === 429) {
    // Rate limited - retry with backoff
  } else if (error.status === 403) {
    // Invalid key - check .env
  } else {
    // Other error
  }
}
```

### 3. Prompt Engineering

```typescript
// ✅ Good - specific, structured, context-aware
const prompt = `
You are an expert biology tutor for 10th grade students.
Explain photosynthesis in exactly 2-3 sentences.
Use simple words. Include 1-2 examples from nature.
`;

// ❌ Bad - vague, no context
const prompt = "Explain photosynthesis";
```

---

## Monitoring API Usage

1. Visit: https://ai.google.dev
2. Go to "API Dashboard"
3. Check:
   - Requests made today
   - Tokens used
   - Error rates
   - Response times

---

## Next Steps

- [ ] Implement language detection service
- [ ] Set up multilingual content generation
- [ ] Integrate text-to-speech for all languages
- [ ] Add speech recognition (ASR) support
- [ ] Migrate translation to Bhashini API (Phase 2)

---

**Last Updated**: May 15, 2026  
**Gemini API Docs**: https://ai.google.dev
