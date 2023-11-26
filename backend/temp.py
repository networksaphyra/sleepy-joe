import openai
import ai_config

client = openai.OpenAI(api_key=open(".env").readline().strip())

def generate_response(query):
    messages = [
                {"role": "system", "content": ai_config.MODEL_INFORMATION["CONTEXT"]},
                {"role": "user", "content": query}
            ]
    response = client.chat.completions.create (
                model = ai_config.MODEL_INFORMATION["MODEL"],
                messages = messages,
            )  
    return response.choices[0].message.content


print(generate_response("Help me sleep, joe!"))