using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemycontroller : MonoBehaviour
{
    Player player;
    public int minDamage;
    public int maxDamage;

    PlayerHealth playerHealth;

    private void Start()
    {
        playerHealth = GetComponent<PlayerHealth>();
    }
    public void TakeDamage(int damage)
    {
        
        if (playerHealth != null)
        {
            playerHealth.TakeDamage(damage);
        }
        else
        {
            Debug.LogError("PlayerHealth is null!");
        }
    }
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Player"))
        {
            player = collision.GetComponent<Player>();
            InvokeRepeating("DamagePlayer", 0, 1.5f);
        }
    }
    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.CompareTag("Player"))
        {
            player = null;
            CancelInvoke("DamagePlayer");
        }

    }
    public void DamagePlayer()
    {
        int damage = UnityEngine.Random.Range(minDamage, maxDamage); // get random between mindame and max dame
        player.TakeDamage(damage);
    }
    

}
