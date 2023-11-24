using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

public class GameOverUI : MonoBehaviour
{
    [SerializeField]
    private Text scoreValueText;

    private int score = 0;

    void Start()
    {
        IntakeDmg.OnPlayerDeath += ActivateGameObject;
        IntakeDmg.OnEnemyDeath += CountScore;
        this.gameObject.SetActive(false);
    }

    private void OnDestroy()
    {
        IntakeDmg.OnPlayerDeath -= ActivateGameObject;
        IntakeDmg.OnEnemyDeath -= CountScore;
    }

    public void ReturnToMenu()
    {
        SceneManager.LoadScene(0);
    }

    private void CountScore()
    {
        score++;
    }

    private void ActivateGameObject()
    {
        this.gameObject.SetActive(true);
        scoreValueText.text = score.ToString();
    }
}
