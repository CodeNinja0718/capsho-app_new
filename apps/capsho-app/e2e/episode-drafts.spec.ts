import { test, expect } from '@playwright/test'

test('Upload an audio file and see outputs', async ({ page }) => {
  // Go to http://localhost:8080/auth/login
  await page.goto('http://localhost:8080/auth/login')
  // Click input[type="email"]
  await page.locator('input[type="email"]').click()
  // Fill input[type="email"]
  await page.locator('input[type="email"]').fill('beck@capsho.com')
  // Click input[type="password"]
  await page.locator('input[type="password"]').click()
  // Fill input[type="password"]
  await page.locator('input[type="password"]').fill('capsho123')
  // Click button:has-text("Sign In") >> nth=0
  await page.locator('button:has-text("Sign In")').first().click()
  await expect(page).toHaveURL('http://localhost:8080/podcast/upload')
  // Click button:has-text("Or choose a file")
  await page.locator('button:has-text("Or choose a file")').click()
  // Upload Loop — KV _ Background Music _ Audio Library Release.mp3
  await page.locator('button:has-text("Or choose a file")').setInputFiles('Loop — KV _ Background Music _ Audio Library Release.mp3')
  // Click button:has-text("Upload")
  await page.locator('button:has-text("Upload")').click()
  // // Click button:has-text("Next")
  // await page.locator('button:has-text("Next")').click()
  // // Click button:has-text("Next")
  // await page.locator('button:has-text("Next")').click()
  // // Click button:has-text("Got it!")
  // await page.locator('button:has-text("Got it!")').click()
  // Click text=No
  await page.locator('text=No').click()
  // Click text=Save to folder...arrow_drop_down >> div >> nth=1
  await page.locator('text=Save to folder...arrow_drop_down >> div').nth(1).click()
  // Click text=Unfiled Episodes
  await page.locator('text=Unfiled Episodes').click()
  // Click button:has-text("Let's go")
  await page.locator('button:has-text("Let\'s go")').click()
  // Go to http://localhost:8080/podcast/upload
  await page.goto('http://localhost:8080/podcast/upload')
  // Go to http://localhost:8080/podcast/episode-drafts
  await page.goto('http://localhost:8080/podcast/episode-drafts')
  // // Click button:has-text("Next")
  // await page.locator('button:has-text("Next")').click()
  // // Click button:has-text("Next")
  // await page.locator('button:has-text("Next")').click()
  // // Click button:has-text("Next")
  // await page.locator('button:has-text("Next")').click()
  // // Click button:has-text("Got it!")
  // await page.locator('button:has-text("Got it!")').click()
  // const re = /\w+/gm
  // const titleDescription = page.locator('text=Title & Description')
  await expect(page).toHaveTitle('Episode Title')
  // Click text=Show notes
  await page.locator('text=Show notes').click()
  // Click text=If you're looking for an opportunity to really grow and be empowered, Unity Comm
  await page.locator('text=If you\'re looking for an opportunity to really grow and be empowered, Unity Comm').click()
  // Click text=Transcript
  await page.locator('text=Transcript').click()
  // Click text=CaptionsGrowthkeyboard_arrow_down
  await page.locator('text=CaptionsGrowthkeyboard_arrow_down').click()
  // Click text=Facebook/Instagram
  await page.locator('text=Facebook/Instagram').click()
  // Click text=LinkedIn >> nth=0
  await page.locator('text=LinkedIn').first().click()
  // Click text=TikTok
  await page.locator('text=TikTok').click()
  // Click text=Twitter
  await page.locator('text=Twitter').click()
  // Click text=CaptionsGrowthkeyboard_arrow_down
  await page.locator('text=CaptionsGrowthkeyboard_arrow_down').click()
  // Click text=Email
  await page.locator('text=Email').click()
  // Click text=Blog Post
  await page.locator('text=Blog Post').click()
  // Click text=LinkedIn Article
  await page.locator('text=LinkedIn Article').click()
  // Click text=YouTube Description
  await page.locator('text=YouTube Description').click()
  // Click text=Title & Description
  await page.locator('text=Title & Description').click()
  // Click text=If you're looking for an opportunity to really grow and be empowered, Unity Comm
  await page.locator('text=If you\'re looking for an opportunity to really grow and be empowered, Unity Comm').click()
  // Click text=If you're looking for an opportunity to really grow and be empowered, Unity Comm
  await page.locator('text=If you\'re looking for an opportunity to really grow and be empowered, Unity Comm').click()
  // Click text=If you're looking for an opportunity to really grow and be empowered, Unity Comm
  await page.locator('text=If you\'re looking for an opportunity to really grow and be empowered, Unity Comm').click()
  // Double click text=If you're looking for an opportunity to really grow and be empowered, Unity Comm
  await page.locator('text=If you\'re looking for an opportunity to really grow and be empowered, Unity Comm').dblclick()
  // Click text=Show notes
  await page.locator('text=Show notes').click()
  // Click text=Title & Description
  await page.locator('text=Title & Description').click()
  // Click text=Show notes
  await page.locator('text=Show notes').click()
  // Click text=Title & Description
  await page.locator('text=Title & Description').click()
  // Click text=Title & DescriptionShow notesTranscriptCaptionsGrowthkeyboard_arrow_downFacebook >> img
  await page.locator('text=Title & DescriptionShow notesTranscriptCaptionsGrowthkeyboard_arrow_downFacebook >> img').click()
  await expect(page).toHaveURL('http://localhost:8080/podcast/folders')
  // Click img >> nth=2
  await page.locator('img').nth(2).click()
  await expect(page).toHaveURL('http://localhost:8080/podcast/episodes/default')
  // Click text=The Down and Dirty on Patrick Brown: How to Build a Successful Team
  await page.locator('text=The Down and Dirty on Patrick Brown: How to Build a Successful Team').click()
  await expect(page).toHaveURL('http://localhost:8080/podcast/episode-drafts?folder=default&episode=Loop+%E2%80%94+KV+_+Background+Music+_+Audio+Library+Release.mp3-1329836-1647869706709-mpeg')
  // Click button:has-text("MY SHOWS")
  await page.locator('button:has-text("MY SHOWS")').click()
  await expect(page).toHaveURL('http://localhost:8080/podcast/folders')
})
