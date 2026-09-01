import time
from typing import List, Dict

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://indiankanoon.org/search/"

def search_case_law(query: str, limit: int = 5) -> List[Dict[str, str]]:
    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9",
    }
    params = {"formInput": query}
    results: List[Dict[str, str]] = []
    try:
        url = BASE_URL
        print("🔗 URL:", url)
        resp = requests.get(url, params=params, headers=headers, timeout=20)
        print("🌐 HTTP Status:", getattr(resp, 'status_code', 'NA'))
        if getattr(resp, 'text', None) is not None:
            print("📑 HTML length:", len(resp.text))
        resp.raise_for_status()
        time.sleep(0.8)
        soup = BeautifulSoup(resp.text, "html.parser")
        items = soup.find_all("div", class_="result")
        for li in items:
            a = li.find("a")
            if not a:
                continue
            title = a.get_text(strip=True)
            href = a.get("href", "")
            if href and not href.startswith("http"):
                href = "https://indiankanoon.org" + href
            snippet_el = li.find("div", class_="snippet") or li
            snippet_text = " ".join(snippet_el.get_text(" ", strip=True).split())
            results.append({"title": title, "link": href, "summary": snippet_text[:400]})
            if len(results) >= limit:
                break
    except Exception as e:
        print("❗ Scraper error:", e)
    print("📂 Results parsed:", len(results))
    return results


