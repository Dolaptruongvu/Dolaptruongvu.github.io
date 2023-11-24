using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Enemycontroller : MonoBehaviour
{
    
    Player playerS;
    public int minDamage;
    public int maxDamage;
    

    IntakeDmg health;

    private void Start()
    {
        health = GetComponent<IntakeDmg>();
    }

    public void TakeDamage(int damage)
    {
        health.TakeDam(damage);

    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.CompareTag("Player"))
        {
            playerS = collision.GetComponent<Player>();
            InvokeRepeating("DamagePlayer", 0 , 0.1f);
        }
    }

    private void OnTriggerExit2D(Collider2D collision)
    {
        if (collision.CompareTag("Player"))
        {
            playerS = null;
            CancelInvoke("DamagePlayer");
            
        }
    }

    void DamagePlayer()
    {
        int damage = Random.Range(minDamage, maxDamage);
        playerS.TakeDamage(damage);
    }
}
