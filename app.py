from flask import Flask, render_template, jsonify, request  # type: ignore
import os
from dotenv import load_dotenv  # type: ignore
import json
import logging
from datetime import datetime
from data_manager import data_manager

# Настройка логирования
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Загружаем переменные окружения из .env файла
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-here')

# Загрузка JSON данных
def load_json_data(filename):
    try:
        with open(os.path.join('json', filename), 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"error": f"File {filename} not found"}

def load_news():
    try:
        with open('data/news.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading news: {e}")
        return []

@app.context_processor
def inject_news():
    return {'news': load_news()}

def load_roadmap():
    try:
        with open('data/roadmap.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Маршруты для веб-страниц
@app.route('/')
def index():
    news = load_news()
    roadmap = load_roadmap()
    return render_template('home.html', news=news, roadmap=roadmap)

@app.route('/damage-calculator')
def damage_calculator():
    return render_template('damage.html')

@app.route('/defense-calculator')
def defense_calculator():
    return render_template('defense.html')

@app.route('/hero_base-stats')
def hero_base_stats():
    try:
        # Получаем данные о героях из CSV
        heroes = data_manager.get_all_heroes()
        logger.debug(f"Retrieved {len(heroes)} heroes from CSV")
        return render_template('hero_base_stats.html', heroes=heroes)
    except Exception as e:
        logger.error(f"Error in hero_base_stats route: {e}")
        return render_template('hero_base_stats.html', heroes=[])

@app.route('/mini-damage-calculator')
def mini_damage_calculator():
    return render_template('mini_damage_calculator.html')

@app.route('/winrate_calculator')
def winrate_calculator():
    return render_template('winrate_calculator.html')

@app.route('/season_progress')
def season_progress():
    return render_template('season_progress.html')

@app.route('/api/heroes')
def get_heroes():
    try:
        # Получаем данные о героях из CSV
        heroes = data_manager.get_all_heroes()
        logger.debug(f"API returned {len(heroes)} heroes")
        return jsonify(heroes)
    except Exception as e:
        logger.error(f"Error in get_heroes API: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/heroes/search')
def search_heroes():
    """API для поиска героев"""
    query = request.args.get('q', '')
    if not query:
        return jsonify([])
    
    try:
        results = data_manager.search_heroes(query)
        return jsonify(results)
    except Exception as e:
        logger.error(f"Error in search_heroes API: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/heroes/<hero_name>')
def get_hero_by_name(hero_name):
    """API для получения героя по имени"""
    try:
        hero = data_manager.get_hero_by_name(hero_name)
        if hero:
            return jsonify(hero)
        else:
            return jsonify({"error": "Hero not found"}), 404
    except Exception as e:
        logger.error(f"Error in get_hero_by_name API: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/heroes/role/<role>')
def get_heroes_by_role(role):
    """API для получения героев по роли"""
    try:
        heroes = data_manager.get_heroes_by_role(role)
        return jsonify(heroes)
    except Exception as e:
        logger.error(f"Error in get_heroes_by_role API: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/emblems')
def get_emblems():
    """API для получения эмблем"""
    try:
        emblems = data_manager.get_emblems()
        return jsonify(emblems)
    except Exception as e:
        logger.error(f"Error in get_emblems API: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/items')
def get_items():
    """API для получения предметов"""
    try:
        items = data_manager.get_items()
        return jsonify(items)
    except Exception as e:
        logger.error(f"Error in get_items API: {e}")
        return jsonify({"error": str(e)}), 500

import threading
import time
import webbrowser

def open_browser():
    # Даем серверу время запуститься
    time.sleep(1)
    webbrowser.get('firefox').open('http://localhost:8080')

if __name__ == '__main__':
    # Запускаем открытие браузера в отдельном потоке
    threading.Thread(target=open_browser).start()
    app.run(debug=True, host='0.0.0.0', port=8080)